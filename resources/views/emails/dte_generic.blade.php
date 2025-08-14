<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>¡Gracias por tu compra!</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 1px solid #eee;
        }

        .header img {
            max-width: 150px;
        }

        .content {
            padding: 20px;
        }

        .content h1 {
            color: #1a237e;
            text-align: center;
        }

        .details {
            background-color: #f9f9f9;
            border-left: 4px solid #1a237e;
            padding: 15px;
            margin-top: 20px;
        }

        .details p {
            margin: 5px 0;
        }

        .footer {
            text-align: center;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 12px;
            color: #777;
        }

        .button {
            display: inline-block;
            background-color: #1a237e;
            color: #ffffff;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 15px;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            {{-- Puedes usar la URL de tu logo --}}
            <img src="{{ $message->embed(public_path('LOGOPARTSFRIO.jpg')) }}" alt="Logo de tu Empresa">
        </div>
        <div class="content">
            <h1>¡Gracias por tu compra!</h1>
            <p>Hola, **{{ $receptor_nombre }}**</p>
            <p>Queremos agradecerte por tu reciente compra. ¡Esperamos que disfrutes de tu(s) producto(s) tanto como nosotros disfrutamos preparándolo(s) para ti!</p>

            <div class="details">
                <p><strong>Número de factura:</strong> {{ $numero_control }}</p>
                <p><strong>Fecha de compra:</strong> {{ $fecha_emision }}</p>
                <p><strong>Monto total:</strong> ${{ number_format($monto_total, 2) }}</p>
            </div>

          <p>A continuación, puedes descargar tu factura en formato PDF o JSON:</p>
        

            <p>Si tienes alguna pregunta, no dudes en contactarnos. Estaremos encantados de ayudarte.</p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} Tu Empresa. Todos los derechos reservados.</p>
            <p>4a. Av. Sur. Res. Santa Olga, #6, Municipio de San Miguel, El Salvador.</p>
        </div>
    </div>
</body>

</html>