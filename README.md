photos
======

一个相册应用，不需要数据库支持。

使用Bootstrap-Image-Gallery https://github.com/blueimp/Bootstrap-Image-Gallery 作为前端展示支持。

系统需要graphicsmagick支持用于作图。

照片放到publice/pictures/origin中, 然后通过scripts/thumbs.js生成缩略图。

scripts/compress.js为可选项目，因为显示时的图片比较小，没有必要用到很大的原图, 这里默认是等比缩放到宽1000px。

我的情况是4k多X3k多分辨率的图。可以进一步节省流量。

默认每页54张照片，可通过config.js来进行进改。
