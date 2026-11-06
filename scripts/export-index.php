<?php

$siteIndex = __DIR__ . '/../_site/index.html';
$outputIndex = __DIR__ . '/../index.html';
$html = file_get_contents($siteIndex);

if ($html === false) {
    fwrite(STDERR, "Cannot read _site/index.html. Build the Cecil site first.\n");
    exit(1);
}

$assets = [
    '~href="/(?:[^"/]+/)?styles\.[^"/]+\.css"~' => 'href="./assets/styles.css"',
    '~src="/(?:[^"/]+/)?app\.[^"/]+\.js"~' => 'src="./assets/app.js"',
];

foreach ($assets as $pattern => $replacement) {
    $html = preg_replace($pattern, $replacement, $html, 1, $count);

    if ($html === null || $count !== 1) {
        fwrite(STDERR, "Cannot find the generated asset reference: $pattern\n");
        exit(1);
    }
}

if (file_put_contents($outputIndex, $html) === false) {
    fwrite(STDERR, "Cannot write index.html.\n");
    exit(1);
}

fwrite(STDOUT, "Exported the Cecil storefront to index.html.\n");
