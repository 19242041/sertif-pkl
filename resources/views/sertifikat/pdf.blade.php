<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">

    <style>
        @page {
            margin: 0;
        }

        html,
        body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
        }

        body {
            margin: 0;
            padding: 0;
            font-family: DejaVu Sans, sans-serif;
        }

        .certificate {
            position: relative;
            width: 100%;
            height: 100%;
            overflow: hidden;
        }

        /*
         * TEMPLATE ASLI
         * Menjadi background penuh halaman.
         */
        .certificate-image {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
        }

        .field {
            position: absolute;
            line-height: 1.15;
            margin: 0;
            padding: 0;
            white-space: pre-wrap;
            overflow-wrap: break-word;
            word-break: break-word;
            box-sizing: border-box;
        }
    </style>
</head>

<body>

<div class="certificate">

    {{-- GAMBAR TEMPLATE ASLI --}}
    <img
        src="{{ $templateImage }}"
        class="certificate-image"
        alt="Template Sertifikat"
    >

    @foreach ($fields as $key => $field)
        @if ($field['text'] !== '')
            <div
                class="field"
                style="
                    left: {{ $field['left'] }}pt;
                    top: {{ $field['top'] }}pt;
                    width: {{ $field['width'] }}pt;
                    font-size: {{ $field['font_size'] }}px;
                    font-family: {{ $field['font_family'] }}, DejaVu Sans, sans-serif;
                    color: {{ $field['color'] }};
                    text-align: {{ $field['alignment'] }};
                "
            >
                {{ $field['text'] }}
            </div>
        @endif
    @endforeach

</div>

</body>
</html>
