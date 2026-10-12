<?php

interface EmployeeRepository
{
    public function usernameExists(string $username): bool;

    public function create(string $name, string $type, string $username, string $password): bool;

    public function delete(string $id): bool;

    public function all(): array;
}

final class PdoEmployeeRepository implements EmployeeRepository
{
    private PDO $connection;

    public function __construct(PDO $connection)
    {
        $this->connection = $connection;
    }

    public function usernameExists(string $username): bool
    {
        $stmt = $this->connection->prepare('SELECT id_empleado FROM empleados WHERE usuario = ?');
        $stmt->execute([$username]);
        return $stmt->fetchColumn() !== false;
    }

    public function create(string $name, string $type, string $username, string $password): bool
    {
        $stmt = $this->connection->prepare(
            'INSERT INTO empleados (nombre, tipo, usuario, contraseña) VALUES (?, ?, ?, SHA2(?, 256))'
        );
        return $stmt->execute([$name, $type, $username, $password]);
    }

    public function delete(string $id): bool
    {
        $stmt = $this->connection->prepare('DELETE FROM empleados WHERE id_empleado = ?');
        return $stmt->execute([$id]);
    }

    public function all(): array
    {
        $stmt = $this->connection->query(
            'SELECT id_empleado, nombre, tipo, usuario FROM empleados ORDER BY id_empleado'
        );
        return $stmt->fetchAll();
    }
}

final class AdminEmployeeProxy implements EmployeeRepository
{
    private EmployeeRepository $repository;
    private array $session;

    public function __construct(EmployeeRepository $repository, array $session)
    {
        $this->repository = $repository;
        $this->session = $session;
    }

    public function authorize(): void
    {
        if (
            !isset($this->session['empleado_id'])
            || ($this->session['empleado_tipo'] ?? null) !== 'administrativo'
        ) {
            throw new DomainException('Acceso exclusivo para personal administrativo.');
        }
    }

    public function usernameExists(string $username): bool
    {
        $this->authorize();
        return $this->repository->usernameExists($username);
    }

    public function create(string $name, string $type, string $username, string $password): bool
    {
        $this->authorize();
        return $this->repository->create($name, $type, $username, $password);
    }

    public function delete(string $id): bool
    {
        $this->authorize();
        return $this->repository->delete($id);
    }

    public function all(): array
    {
        $this->authorize();
        return $this->repository->all();
    }
}
