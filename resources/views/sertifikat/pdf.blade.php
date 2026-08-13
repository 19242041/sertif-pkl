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
            display: inline-block;
            box-sizing: border-box;
            font-family: DejaVu Sans, sans-serif;
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

    {{-- NOMOR SERTIFIKAT --}}
    <div
        class="field"
        style="
            left: {{ $template->nomor_x }}%;
            top: {{ $template->nomor_y }}%;
            max-width: {{ $template->nomor_lebar_max }}%;
            font-size: {{ $fontSizes['nomor'] }}px;
            color: {{ $colors['nomor'] }};
            text-align: {{ $template->nomor_alignment }};
            transform: translate(
                {{ $template->nomor_alignment === 'center'
                    ? '-50%'
                    : ($template->nomor_alignment === 'right'
                        ? '-100%'
                        : '0')
                }},
                -50%
            );
        "
    >
        {{ $nomorText }}
    </div>

    {{-- NAMA PESERTA --}}
    <div
        class="field"
        style="
            left: {{ $template->nama_x }}%;
            top: {{ $template->nama_y }}%;
            max-width: {{ $template->nama_lebar_max }}%;
            font-size: {{ $fontSizes['nama'] }}px;
            color: {{ $colors['nama'] }};
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
            max-width: {{ $template->periode_lebar_max }}%;
            font-size: {{ $fontSizes['periode'] }}px;
            color: {{ $colors['periode'] }};
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
            max-width: {{ $template->tanggal_lebar_max }}%;
            font-size: {{ $fontSizes['tanggal'] }}px;
            color: {{ $colors['tanggal'] }};
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