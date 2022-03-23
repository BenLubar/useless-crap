#!/bin/bash -e

ffmpeg -lavfi '
color@t0=c=black:size=360x90:r=1:d=7200,
drawtext@t1=fontcolor=white:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf:fontsize=40:x=(w-text_w)/2:y=10:text=Tyria\\\: Night,
drawtext@t2=fontcolor=white:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf:fontsize=20:x=(w-text_w)/2:y=60:text=Dawn in %{eif\\\:mod(8700-n\,7200)/60\\\:d}\\\:%{eif\\\:mod((8700-n)\\\,60)\\\:d\\\:2},
sendcmd=c='\''1500 color@t0 c blue;1800 color@t0 c white,drawtext@t1 reinit fontcolor=black,drawtext@t2 reinit fontcolor=black;6000 color@t0 c orange;6300 color@t0 c black,drawtext@t1 reinit fontcolor=white,drawtext@t2 reinit fontcolor=white'\'',
sendcmd=c='\''1500 drawtext@t1 reinit text=Tyria\\\\\\\:\\\\\\\ Dawn;1800 drawtext@t1 reinit text=Tyria\\\\\\\:\\\\\\\ Day;6000 drawtext@t1 reinit text=Tyria\\\\\\\:\\\\\\\ Dusk;6300 drawtext@t1 reinit text=Tyria\\\\\\\:\\\\\\\ Night'\'',
sendcmd=c='\''1500 drawtext@t2 reinit text=Day\\\\\\\ in\\\\\\\ %{eif\\\\\\\:(1800-n)/60\\\\\\\:d}\\\\\\\:%{eif\\\\\\\:mod(1800-n\\\\\\\,60)\\\\\\\:d\\\\\\\:2};1800 drawtext@t2 reinit text=Dusk\\\\\\\ in\\\\\\\ %{eif\\\\\\\:(6000-n)/60\\\\\\\:d}\\\\\\\:%{eif\\\\\\\:mod(6000-n\\\\\\\,60)\\\\\\\:d\\\\\\\:2};6000 drawtext@t2 reinit text=Night\\\\\\\ in\\\\\\\ %{eif\\\\\\\:(6300-n)/60\\\\\\\:d}\\\\\\\:%{eif\\\\\\\:mod(6300-n\\\\\\\,60)\\\\\\\:d\\\\\\\:2};6300 drawtext@t2 reinit text=Dawn\\\\\\\ in\\\\\\\ %{eif\\\\\\\:mod(8700-n\\\\\\\,7200)/60\\\\\\\:d}\\\\\\\:%{eif\\\\\\\:mod(8700-n\\\\\\\,60)\\\\\\\:d\\\\\\\:2}'\''[tyria];
color@c0=c=black:size=360x90:r=1:d=7200,
drawtext@c1=fontcolor=white:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf:fontsize=40:x=(w-text_w)/2:y=10:text=Cantha\\\: Night,
drawtext@c2=fontcolor=white:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf:fontsize=20:x=(w-text_w)/2:y=60:text=Dawn in %{eif\\\:mod(9300-n\,7200)/60\\\:d}\\\:%{eif\\\:mod((9300-n)\\\,60)\\\:d\\\:2},
sendcmd=c='\''2100 color@c0 c blue;2400 color@c0 c white,drawtext@c1 reinit fontcolor=black,drawtext@c2 reinit fontcolor=black;5700 color@c0 c orange;6000 color@c0 c black,drawtext@c1 reinit fontcolor=white,drawtext@c2 reinit fontcolor=white'\'',
sendcmd=c='\''2100 drawtext@c1 reinit text=Cantha\\\\\\\:\\\\\\\ Dawn;2400 drawtext@c1 reinit text=Cantha\\\\\\\:\\\\\\\ Day;5700 drawtext@c1 reinit text=Cantha\\\\\\\:\\\\\\\ Dusk;6000 drawtext@c1 reinit text=Cantha\\\\\\\:\\\\\\\ Night'\'',
sendcmd=c='\''2100 drawtext@c2 reinit text=Day\\\\\\\ in\\\\\\\ %{eif\\\\\\\:(2400-n)/60\\\\\\\:d}\\\\\\\:%{eif\\\\\\\:mod(2400-n\\\\\\\,60)\\\\\\\:d\\\\\\\:2};2400 drawtext@c2 reinit text=Dusk\\\\\\\ in\\\\\\\ %{eif\\\\\\\:(5700-n)/60\\\\\\\:d}\\\\\\\:%{eif\\\\\\\:mod(5700-n\\\\\\\,60)\\\\\\\:d\\\\\\\:2};5700 drawtext@c2 reinit text=Night\\\\\\\ in\\\\\\\ %{eif\\\\\\\:(6300-n)/60\\\\\\\:d}\\\\\\\:%{eif\\\\\\\:mod(6300-n\\\\\\\,60)\\\\\\\:d\\\\\\\:2};6000 drawtext@c2 reinit text=Dawn\\\\\\\ in\\\\\\\ %{eif\\\\\\\:mod(9300-n\\\\\\\,7200)/60\\\\\\\:d}\\\\\\\:%{eif\\\\\\\:mod(9300-n\\\\\\\,60)\\\\\\\:d\\\\\\\:2}'\''[cantha];
[tyria][cantha]vstack
' -preset veryslow -movflags faststart -y tyria-time.mp4
