async function generateEPUB() {
    const zip = new JSZip();
    const content = document.getElementById('editor').innerHTML;

    // ၁။ mimetype ဖိုင် (ePub အတွက် မဖြစ်မနေလိုတယ်)
    zip.file("mimetype", "application/epub+zip");

    // ၂။ container.xml ဖိုင် (META-INF ဖိုဒါထဲမှာ ထည့်ရမယ်)
    zip.file("META-INF/container.xml", '<?xml version="1.0" encoding="UTF-8"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>');

    // ၃။ content.opf ဖိုင် (စာအုပ်ဖွဲ့စည်းပုံ - ဒီနေရာမှာ အနည်းငယ် ပြင်ထားပါတယ်)
    zip.file("content.opf", '<?xml version="1.0" encoding="UTF-8"?><package version="3.0" xmlns="http://www.id3.org/2007/opf" unique-identifier="pub-id"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:title>My Book</dc:title><dc:language>my</dc:language></metadata><manifest><item id="t1" href="index.html" media-type="application/xhtml+xml"/></manifest><spine><itemref idref="t1"/></spine></package>');

    // ၄။ index.html (body tag ကို သေချာ ထည့်ပေးပါ)
    zip.file("index.html", `<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml"><head><title>My Book</title></head><body>${content}</body></html>`);

    // ၅။ ပုံများကို zip ထဲထည့်ခြင်း
    const doc = new DOMParser().parseFromString(content, 'text/html');
    doc.querySelectorAll('img').forEach((img, i) => {
        const base64Data = img.src.split(',')[1];
        zip.file(`images/img_${i}.jpg`, base64Data, {base64: true});
        img.src = `images/img_${i}.jpg`;
    });

    zip.generateAsync({type:"blob", mimeType: "application/epub+zip"}).then(blob => saveAs(blob, "MyBook.epub"));
}
