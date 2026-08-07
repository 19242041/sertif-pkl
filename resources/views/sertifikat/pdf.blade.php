<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <style>
        @page { margin: 0; }
        html, body { margin: 0; padding: 0; width: 100%; height: 100%; }
        body { font-family: DejaVu Sans, sans-serif; }
        .canvas { position: relative; width: 100%; height: 100%; }
        .canvas img { display: block; width: 100%; height: auto; }
        .field { position: absolute; color: #1b2733; white-space: pre-wrap; line-height: 1.15; }
    </style>
</head>
<body>
    <div class="canvas">
        <img src="{{ $templateImage }}" alt="Template Sertifikat">

        <div class="field" style="left: {{ $template->nama_x }}%; top: {{ $template->nama_y }}%; font-size: {{ $template->nama_font_size }}px; text-align: {{ $template->nama_alignment }}; transform: translate({{ $template->nama_alignment === 'center' ? '-50%' : ($template->nama_alignment === 'right' ? '-100%' : '0') }}, -50%);">
            {{ $namaPeserta }}
        </div>

        <div class="field" style="left: {{ $template->periode_x }}%; top: {{ $template->periode_y }}%; font-size: {{ $template->periode_font_size }}px; text-align: {{ $template->periode_alignment }}; transform: translate({{ $template->periode_alignment === 'center' ? '-50%' : ($template->periode_alignment === 'right' ? '-100%' : '0') }}, -50%);">
            {{ $periodeText }}
        </div>

        <div class="field" style="left: {{ $template->tanggal_x }}%; top: {{ $template->tanggal_y }}%; font-size: {{ $template->tanggal_font_size }}px; text-align: {{ $template->tanggal_alignment }}; transform: translate({{ $template->tanggal_alignment === 'center' ? '-50%' : ($template->tanggal_alignment === 'right' ? '-100%' : '0') }}, -50%);">
            {{ $tanggalText }}
        </div>
    </div>
</body>
</html>