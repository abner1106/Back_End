<?php

final class ReportPeriodAdapter
{
    public function adapt(array $query): array
    {
        $type = $query['tipo'] ?? 'dia';
        if (!in_array($type, ['dia', 'semana', 'mes', 'personalizado'], true)) {
            throw new InvalidArgumentException('Tipo de reporte no válido', 400);
        }

        switch ($type) {
            case 'dia':
                $start = $this->requireDate($query['fecha'] ?? date('Y-m-d'), 'Formato de fecha inválido para día');
                $end = $start;
                $title = 'Ventas del día ' . date('d/m/Y', strtotime($start));
                break;
            case 'semana':
                $start = $this->requireDate($query['fecha'] ?? date('Y-m-d'), 'Formato de fecha inválido para semana');
                $end = (new DateTimeImmutable($start))->modify('+6 days')->format('Y-m-d');
                $title = 'Ventas de la semana ' . date('d/m/Y', strtotime($start))
                    . ' al ' . date('d/m/Y', strtotime($end));
                break;
            case 'mes':
                $month = $query['fecha'] ?? date('Y-m');
                if (
                    !is_string($month)
                    || !preg_match('/^(\d{4})-(\d{2})$/', $month, $matches)
                    || !checkdate((int) $matches[2], 1, (int) $matches[1])
                ) {
                    throw new InvalidArgumentException('Formato de mes inválido', 400);
                }
                $start = $month . '-01';
                $end = date('Y-m-t', strtotime($start));
                $title = 'Ventas del mes ' . date('m/Y', strtotime($start));
                break;
            case 'personalizado':
                $start = $this->requireDate($query['inicio'] ?? date('Y-m-d'), 'Formato de fechas inválido');
                $end = $this->requireDate($query['fin'] ?? date('Y-m-d'), 'Formato de fechas inválido');
                if ($start > $end) {
                    throw new InvalidArgumentException(
                        'La fecha de inicio no puede ser mayor a la fecha final',
                        400
                    );
                }
                $title = 'Ventas del ' . date('d/m/Y', strtotime($start))
                    . ' al ' . date('d/m/Y', strtotime($end));
                break;
        }

        return [
            'inicio' => $start,
            'fin' => $end,
            'titulo' => $title,
        ];
    }

    private function requireDate($value, string $errorMessage): string
    {
        if (
            !is_string($value)
            || !preg_match('/^(\d{4})-(\d{2})-(\d{2})$/', $value, $matches)
            || !checkdate((int) $matches[2], (int) $matches[3], (int) $matches[1])
        ) {
            throw new InvalidArgumentException($errorMessage, 400);
        }

        return $value;
    }
}
