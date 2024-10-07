<?php
// Encabezados de CORS
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Configuración de la sesión
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/', // Asegura que la cookie sea accesible en todas las rutas
    'domain' => 'localhost',
    'secure' => false, // Cambia a true si usas HTTPS
    'httponly' => true,
    'samesite' => 'Lax', // O 'None' si usas HTTPS y quieres enviar cookies en solicitudes cross-site
]);
session_start();

// Conexión a la base de datos utilizando PDO
$dbHost = 'localhost';
$dbName = 'proyecto-1';  // Nombre de la base de datos
$dbUser = 'root';
$dbPass = "";

try {
    $db = new PDO("mysql:host=$dbHost;dbname=$dbName;charset=utf8", $dbUser, $dbPass);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['error' => "Error de conexión: " . $e->getMessage()]);
    exit;
}

// Función para verificar si el usuario está autenticado (sesión iniciada)
function isAuthenticated() {
    return isset($_SESSION['user']);
}

// Obtener el método HTTP y la URI solicitada
$method = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'];

// Función para manejar el logout
function handleLogout() {
    session_unset();
    session_destroy();
    echo json_encode(['message' => 'Sesión cerrada']);
}

// Manejar diferentes métodos HTTP
switch ($method) {
    case 'POST':
        // Manejar el registro e inicio de sesión
        $data = json_decode(file_get_contents('php://input'), true);
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';

        if (strpos($uri, '/login') !== false) {
            // Manejo de login
            $query = "SELECT * FROM users WHERE email = :email";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':email', $email);
            $stmt->execute();
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$user) {
                // Si el usuario no existe
                header('HTTP/1.1 401 Unauthorized');
                echo json_encode(['error' => 'Correo electrónico no encontrado']);
            } elseif (!password_verify($password, $user['password'])) {
                // Si la contraseña no coincide
                header('HTTP/1.1 401 Unauthorized');
                echo json_encode(['error' => 'Contraseña incorrecta']);
            } else {
                // Login exitoso
                // Guardamos la información del usuario en la sesión
                $_SESSION['user'] = [
                    'id' => $user['id'],
                    'name' => $user['name'],
                    'role' => $user['role']
                ];
                echo json_encode(['message' => 'Inicio de sesión exitoso', 'user' => $_SESSION['user']]);
            }
        } elseif (strpos($uri, '/register') !== false) {
            // Manejo de registro
            $name = $data['name'] ?? '';
            if (empty($name)) {
                header('HTTP/1.1 400 Bad Request');
                echo json_encode(['error' => 'El nombre es obligatorio']);
                exit;
            }

            // Podemos asignar un rol por defecto, por ejemplo 'user'
            $role = 'user';

            $query = "SELECT * FROM users WHERE email = :email";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':email', $email);
            $stmt->execute();
            $existingUser = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($existingUser) {
                header('HTTP/1.1 400 Bad Request');
                echo json_encode(['error' => 'El usuario ya existe']);
            } else {
                // Registrar nuevo usuario
                $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
                $insertQuery = "INSERT INTO users (name, email, password, role) VALUES (:name, :email, :password, :role)";
                $insertStmt = $db->prepare($insertQuery);
                $insertStmt->bindParam(':name', $name);
                $insertStmt->bindParam(':email', $email);
                $insertStmt->bindParam(':password', $hashedPassword);
                $insertStmt->bindParam(':role', $role);

                if ($insertStmt->execute()) {
                    echo json_encode(['message' => 'Registro realizado con éxito']);
                } else {
                    echo json_encode(['error' => 'Error al registrar el usuario']);
                }
            }
        } elseif (strpos($uri, '/logout') !== false) {
            // Cierre de sesión
            handleLogout();
        } elseif (strpos($uri, '/proyectos') !== false) {
            // Manejo de creación de proyectos
            if (!isAuthenticated()) {
                header('HTTP/1.1 401 Unauthorized');
                echo json_encode(['error' => 'No autenticado']);
                exit;
            }

            $nombre = $data['nombre'] ?? '';
            $descripcion = $data['descripcion'] ?? '';
            $fecha_inicio = $data['fecha_inicio'] ?? null;
            $fecha_fin = $data['fecha_fin'] ?? null;
            $usuario_asignado = $data['usuarioAsignado'] ?? null;
            $user_id = $_SESSION['user']['id'];

            // Validar que 'usuario_asignado' existe en la tabla 'users'
            if ($usuario_asignado) {
                $query = "SELECT id FROM users WHERE id = :id";
                $stmt = $db->prepare($query);
                $stmt->bindParam(':id', $usuario_asignado);
                $stmt->execute();
                if (!$stmt->fetch()) {
                    header('HTTP/1.1 400 Bad Request');
                    echo json_encode(['error' => 'Usuario asignado no existe']);
                    exit;
                }
            }

            $query = "INSERT INTO proyectos (nombre, descripcion, fecha_inicio, fecha_fin, user_id, usuario_asignado) 
                      VALUES (:nombre, :descripcion, :fecha_inicio, :fecha_fin, :user_id, :usuario_asignado)";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':nombre', $nombre);
            $stmt->bindParam(':descripcion', $descripcion);
            $stmt->bindParam(':fecha_inicio', $fecha_inicio);
            $stmt->bindParam(':fecha_fin', $fecha_fin);
            $stmt->bindParam(':user_id', $user_id);
            $stmt->bindParam(':usuario_asignado', $usuario_asignado);
            $stmt->execute();

            $proyectoId = $db->lastInsertId();
            $query = "SELECT * FROM proyectos WHERE id = :id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':id', $proyectoId);
            $stmt->execute();
            $proyecto = $stmt->fetch(PDO::FETCH_ASSOC);

            echo json_encode($proyecto);
        } else {
            header('HTTP/1.1 404 Not Found');
            echo json_encode(['error' => 'Ruta no válida']);
        }
        break;

    case 'PUT':
        // Actualizar proyectos
        if (preg_match('/\/proyectos\/(\d+)/', $uri, $matches)) {
            if (!isAuthenticated()) {
                header('HTTP/1.1 401 Unauthorized');
                echo json_encode(['error' => 'No autenticado']);
                exit;
            }

            $id = $matches[1];
            $data = json_decode(file_get_contents('php://input'), true);
            $nombre = $data['nombre'] ?? '';
            $descripcion = $data['descripcion'] ?? '';
            $fecha_inicio = $data['fecha_inicio'] ?? null;
            $fecha_fin = $data['fecha_fin'] ?? null;
            $estado = $data['estado'] ?? 'pendiente';
            $usuario_asignado = $data['usuarioAsignado'] ?? null;
            $user_id = $_SESSION['user']['id'];

            // Validar que 'usuario_asignado' existe en la tabla 'users'
            if ($usuario_asignado) {
                $query = "SELECT id FROM users WHERE id = :id";
                $stmt = $db->prepare($query);
                $stmt->bindParam(':id', $usuario_asignado);
                $stmt->execute();
                if (!$stmt->fetch()) {
                    header('HTTP/1.1 400 Bad Request');
                    echo json_encode(['error' => 'Usuario asignado no existe']);
                    exit;
                }
            }

            $query = "UPDATE proyectos SET 
                      nombre = :nombre, 
                      descripcion = :descripcion, 
                      fecha_inicio = :fecha_inicio, 
                      fecha_fin = :fecha_fin,
                      estado = :estado,
                      usuario_asignado = :usuario_asignado
                      WHERE id = :id AND user_id = :user_id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':nombre', $nombre);
            $stmt->bindParam(':descripcion', $descripcion);
            $stmt->bindParam(':fecha_inicio', $fecha_inicio);
            $stmt->bindParam(':fecha_fin', $fecha_fin);
            $stmt->bindParam(':estado', $estado);
            $stmt->bindParam(':usuario_asignado', $usuario_asignado);
            $stmt->bindParam(':id', $id);
            $stmt->bindParam(':user_id', $user_id);
            $stmt->execute();

            // Obtener el proyecto actualizado
            $query = "SELECT * FROM proyectos WHERE id = :id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            $proyecto = $stmt->fetch(PDO::FETCH_ASSOC);

            echo json_encode($proyecto);
        } else {
            header('HTTP/1.1 404 Not Found');
            echo json_encode(['error' => 'Proyecto no encontrado']);
        }
        break;

    case 'GET':
        if (strpos($uri, '/session') !== false) {
            // Verificación de sesión
            if (isset($_SESSION['user'])) {
                echo json_encode([
                    'loggedIn' => true,
                    'user' => $_SESSION['user']
                ]);
            } else {
                echo json_encode(['loggedIn' => false]);
            }
        } elseif (strpos($uri, '/usuarios') !== false) {
            // Obtener usuarios para asignar a proyectos
            try {
                $query = "SELECT id, name FROM users"; // Selecciona solo los campos necesarios
                $stmt = $db->prepare($query);
                $stmt->execute();
                $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);

                // Asegura que siempre retorna un array, incluso si está vacío
                if (empty($usuarios)) {
                    echo json_encode(['message' => 'No se encontraron usuarios']);
                } else {
                    echo json_encode($usuarios);
                }
            } catch (PDOException $e) {
                // Enviar un error si ocurre un fallo en la consulta
                header('HTTP/1.1 500 Internal Server Error');
                echo json_encode(['error' => 'Error al obtener los usuarios: ' . $e->getMessage()]);
            }
        } elseif (strpos($uri, '/proyectos') !== false) {
            // Obtener proyectos
            if (!isAuthenticated()) {
                header('HTTP/1.1 401 Unauthorized');
                echo json_encode(['error' => 'No autenticado']);
                exit;
            }

            $user_id = $_SESSION['user']['id'];
            $query = "SELECT * FROM proyectos WHERE user_id = :user_id OR usuario_asignado = :user_id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':user_id', $user_id);
            $stmt->execute();
            $proyectos = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Convertir fechas a formato ISO 8601
            foreach ($proyectos as &$proyecto) {
                $proyecto['fecha_inicio'] = date('c', strtotime($proyecto['fecha_inicio']));
                $proyecto['fecha_fin'] = date('c', strtotime($proyecto['fecha_fin']));
            }

            echo json_encode($proyectos ?: []);  // Asegura que siempre retorna un array
        } elseif (preg_match('/\/proyectos\/(\d+)/', $uri, $matches)) {
            // Obtener proyecto por ID
            if (!isAuthenticated()) {
                header('HTTP/1.1 401 Unauthorized');
                echo json_encode(['error' => 'No autenticado']);
                exit;
            }

            $id = $matches[1];
            $user_id = $_SESSION['user']['id'];
            $query = "SELECT * FROM proyectos WHERE id = :id AND (user_id = :user_id OR usuario_asignado = :user_id)";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':id', $id);
            $stmt->bindParam(':user_id', $user_id);
            $stmt->execute();
            $proyecto = $stmt->fetch(PDO::FETCH_ASSOC);

            // Convertir fechas a formato ISO 8601
            if ($proyecto) {
                $proyecto['fecha_inicio'] = date('c', strtotime($proyecto['fecha_inicio']));
                $proyecto['fecha_fin'] = date('c', strtotime($proyecto['fecha_fin']));
            }

            echo json_encode($proyecto ?: []);  // Asegura que siempre retorna un array vacío si no hay resultados
        } else {
            header('HTTP/1.1 404 Not Found');
            echo json_encode(['error' => 'Ruta no válida']);
        }
        break;

    case 'DELETE':
        if (preg_match('/\/proyectos\/(\d+)/', $uri, $matches)) {
            // Eliminar proyecto por ID
            if (!isAuthenticated()) {
                header('HTTP/1.1 401 Unauthorized');
                echo json_encode(['error' => 'No autenticado']);
                exit;
            }

            $id = $matches[1];
            $user_id = $_SESSION['user']['id'];

            // Solo el creador del proyecto puede eliminarlo
            $query = "DELETE FROM proyectos WHERE id = :id AND user_id = :user_id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':id', $id);
            $stmt->bindParam(':user_id', $user_id);

            if ($stmt->execute()) {
                echo json_encode(['message' => 'Proyecto eliminado']);
            } else {
                echo json_encode(['error' => 'Error al eliminar el proyecto']);
            }
        } else {
            header('HTTP/1.1 404 Not Found');
            echo json_encode(['error' => 'Proyecto no encontrado']);
        }
        break;

    default:
        header('HTTP/1.1 405 Method Not Allowed');
        echo json_encode(['error' => 'Método HTTP no válido']);
        break;
}
?>
