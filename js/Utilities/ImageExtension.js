function Convert(imageData) {
    let imgdata = [];
    for (let i = 0; i < imageData.length; i += 2) {
        let byte1 = imageData[i], byte2 = imageData[i + 1];
        let ARGB1555 = (byte2 << 8) + byte1;
        let a = ARGB1555 & 0x8000, r = ARGB1555 & 0x7C00, g = ARGB1555 & 0x03E0, b = ARGB1555 & 0x1F;
        let rgb = (r << 9) | (g << 6) | (b << 3);
        let ARGB8888 = (a * 0x1FE00) + rgb + ((rgb >> 5) & 0x070707);

        // ARGB8888 to BGRA8888
        imgdata.push((ARGB8888 >> 16) & 0xFF, (ARGB8888 >> 8) & 0xFF, ARGB8888 & 0xFF, (ARGB8888 >> 24) & 0xFF);
    }
    return imgdata;
}