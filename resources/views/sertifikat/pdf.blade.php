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

        @import url('https://fonts.googleapis.com/css2?family=Luxurious+Script&display=swap');

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
            display: inline-block;
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

    {{-- NAMA PESERTA --}}
    <div
        class="field"
        style="
            left: {{ $template->nama_x }}%;
            top: {{ $template->nama_y }}%;
            width: {{ $template->nama_lebar_max }}%;
            max-width: {{ $template->nama_lebar_max }}%;
            font-size: {{ $fontSizes['nama'] }}px;
<<<<<<< HEAD
            color: {{ $colors['nama'] }};
=======
            color: {{ $template->nama_color }};
            font-family: '{{ $template->nama_font_family }}', cursive, sans-serif;
>>>>>>> 3bb9cb7891f17e44bd23793f456857729951a19e
            text-align: {{ $template->nama_alignment }};
            transform: translate(
                {{ $template->nama_alignment === 'center'
                    ? '-50%'
                    : ($template->nama_alignment === 'right'
                        ? '-100%'
                        : '0')
                }},
                -50%
            );
        "
    >
        {{ $namaPeserta }}
    </div>

    {{-- ASAL SEKOLAH --}}
    <div
        class="field"
        style="
            left: {{ $template->asal_x }}%;
            top: {{ $template->asal_y }}%;
            max-width: {{ $template->asal_lebar_max }}%;
            font-size: {{ $fontSizes['asal'] }}px;
            color: {{ $colors['asal'] }};
            text-align: {{ $template->asal_alignment }};
            transform: translate(
                {{ $template->asal_alignment === 'center'
                    ? '-50%'
                    : ($template->asal_alignment === 'right'
                        ? '-100%'
                        : '0')
                }},
                -50%
            );
        "
    >
        {{ $asalText }}
    </div>

    {{-- PERIODE PKL --}}
    <div
        class="field"
        style="
            left: {{ $template->periode_x }}%;
            top: {{ $template->periode_y }}%;
            width: {{ $template->periode_lebar_max }}%;
            max-width: {{ $template->periode_lebar_max }}%;
            font-size: {{ $fontSizes['periode'] }}px;
<<<<<<< HEAD
            color: {{ $colors['periode'] }};
=======
            color: {{ $template->periode_color }};
            font-family: '{{ $template->periode_font_family }}', serif;
>>>>>>> 3bb9cb7891f17e44bd23793f456857729951a19e
            text-align: {{ $template->periode_alignment }};
            transform: translate(
                {{ $template->periode_alignment === 'center'
                    ? '-50%'
                    : ($template->periode_alignment === 'right'
                        ? '-100%'
                        : '0')
                }},
                -50%
            );
        "
    >
        {{ $periodeText }}
    </div>

    {{-- TANGGAL --}}
    <div
        class="field"
        style="
            left: {{ $template->tanggal_x }}%;
            top: {{ $template->tanggal_y }}%;
            width: {{ $template->tanggal_lebar_max }}%;
            max-width: {{ $template->tanggal_lebar_max }}%;
            font-size: {{ $fontSizes['tanggal'] }}px;
<<<<<<< HEAD
            color: {{ $colors['tanggal'] }};
=======
            color: {{ $template->tanggal_color }};
            font-family: '{{ $template->tanggal_font_family }}', serif;
>>>>>>> 3bb9cb7891f17e44bd23793f456857729951a19e
            text-align: {{ $template->tanggal_alignment }};
            transform: translate(
                {{ $template->tanggal_alignment === 'center'
                    ? '-50%'
                    : ($template->tanggal_alignment === 'right'
                        ? '-100%'
                        : '0')
                }},
                -50%
            );
        "
    >
        {{ $tanggalText }}
    </div>

</div>

</body>
</html>