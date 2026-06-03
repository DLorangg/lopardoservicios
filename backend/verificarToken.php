<?php

// Función auxiliar para codificar (debe coincidir con la de login.php)
function base64url_encode_jwt($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

// 1. Obtenemos los encabezados que nos envía React (Axios)
$headers = apache_request_headers();
$authHeader = $headers['Authorization'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? '';

// 2. Buscamos el formato "Bearer [TOKEN]"
if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    $jwt = $matches[1];
    $tokenParts = explode('.', $jwt);
    
    // Un JWT siempre tiene 3 partes
    if (count($tokenParts) === 3) {
        $payload = base64_decode($tokenParts[1]);
        $signatureProvided = $tokenParts[2];

        // La misma clave secreta que usamos en login.php
        $secret = getenv('JWT_SECRET') ?: 'mi_clave_super_secreta_lopardo_2026';
        
        // 3. Volvemos a firmar el encabezado y el payload para ver si coincide con la firma enviada
        $signature = hash_hmac('sha256', $tokenParts[0] . "." . $tokenParts[1], $secret, true);
        $base64UrlSignature = base64url_encode_jwt($signature);

        if (hash_equals($base64UrlSignature, $signatureProvided)) {
            $payloadData = json_decode($payload, true);
            
            // 4. Verificamos que el token no haya expirado
            if (isset($payloadData['exp']) && $payloadData['exp'] >= time()) {
                // ÉXITO: El token es válido. Dejamos que el script PHP continúe.
                $usuarioLogueado = $payloadData; // Guardamos esto por si algún archivo lo necesita luego
                return; 
            } else {
                http_response_code(401);
                echo json_encode(['error' => 'La sesión ha expirado. Vuelve a iniciar sesión.']);
                exit;
            }
        }
    }
}

// 5. Si el código llega hasta aquí, significa que NO hay token o es falso/modificado.
http_response_code(401);
echo json_encode(['error' => 'Acceso denegado. No estás autorizado.']);
exit;
?>