<?php
declare(strict_types=1);
$bootstrap = getenv('RM_API_BOOTSTRAP');
if (!is_string($bootstrap) || $bootstrap === '') {
    // Production places the frontend document root beside api/. Local builds
    // are served from frontend/dist, one level deeper. Support both layouts
    // without exposing an absolute hosting path in the public bundle.
    $candidates = [
        dirname(__DIR__) . '/api/bootstrap.php',
        dirname(__DIR__, 2) . '/api/bootstrap.php',
    ];
    $bootstrap = $candidates[0];
    foreach ($candidates as $candidate) {
        if (is_file($candidate) && is_readable($candidate)) {
            $bootstrap = $candidate;
            break;
        }
    }
}
try {
    // PHP 7.4 cannot catch a failed require of a missing file. Check first so a
    // missing deployment/bootstrap still returns the intended safe 503 page.
    if (!is_file($bootstrap) || !is_readable($bootstrap)) {
        throw new RuntimeException('Frontend bootstrap unavailable.');
    }
    $services = require $bootstrap;
    $root = dirname($bootstrap);
    $media = require $root . '/config/media.php';
    $auth = require $root . '/config/auth.php';
    $site = new RmDesign\Content\PublicSite($services['db'], $media, $auth['environment'], __DIR__ . '/app-shell.html');
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    if (!in_array($method, ['GET', 'HEAD'], true)) {
        http_response_code(405);
        header('Allow: GET, HEAD');
        header('Content-Type: text/plain; charset=utf-8');
        if ($method !== 'HEAD') {
            echo 'Method not allowed.';
        }
        exit;
    }
    $result = $site->render($_SERVER['REQUEST_URI'] ?? '/');
    http_response_code($result['status']);
    header('Content-Type: ' . $result['contentType']);
    header('Cache-Control: ' . $result['cache']);
    header('X-Content-Type-Options: nosniff');
    header('Content-Security-Policy: ' . RmDesign\Http\ContentSecurityPolicy::frontend(
        (string) $media['api_origin'],
        $auth['environment'] === 'production'
    ));
    if (isset($result['location'])) {
        header('Location: ' . $result['location'], true, $result['status']);
    }
    if ($auth['environment'] !== 'production' || $result['status'] >= 400) {
        header('X-Robots-Tag: noindex, nofollow, noarchive');
    }
    if ($method !== 'HEAD') {
        echo $result['body'];
    }
} catch (Throwable $error) {
    error_log('Frontend failure type=' . get_class($error));
    http_response_code(503);
    header('Content-Type: text/html; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    header("Content-Security-Policy: default-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'; object-src 'none'");
    header('X-Robots-Tag: noindex, nofollow, noarchive');
    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'HEAD') {
        echo '<!doctype html><html lang="zh-Hant"><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><title>服務暫時無法使用</title><h1>服務暫時無法使用</h1><p>請稍後再試。</p></html>';
    }
}
