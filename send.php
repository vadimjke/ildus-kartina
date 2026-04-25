<?php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: index.html');
    exit;
}

$name    = htmlspecialchars(trim($_POST['name']    ?? ''));
$email   = filter_var(trim($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$phone   = htmlspecialchars(trim($_POST['phone']   ?? ''));
$message = htmlspecialchars(trim($_POST['message'] ?? ''));

if (!$email) {
    header('Location: index.html#contact?error=' . urlencode('Укажите корректный email'));
    exit;
}

$to      = 'ildus.murtazin@mail.ru';
$subject = "Запрос с сайта от {$name}";
$body    = "Имя: {$name}\nEmail: {$email}\nТелефон: {$phone}\n\nСообщение:\n{$message}";
$headers = "From: {$email}\r\nReply-To: {$email}\r\nContent-Type: text/plain; charset=UTF-8";

if (mail($to, $subject, $body, $headers)) {
    header('Location: index.html#contact?sent=1');
} else {
    header('Location: index.html#contact?error=' . urlencode('Ошибка отправки — напишите напрямую на email'));
}
exit;
