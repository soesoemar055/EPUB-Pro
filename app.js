const editor = document.getElementById('editor');

// ၁။ Auto-save
editor.addEventListener('input', () => localStorage.setItem('savedContent', editor.innerHTML));
window.onload = () => {
    const saved = localStorage.getItem('savedContent');
    if (saved) editor.innerHTML = saved;
};

// ၂။ အခန်းသစ်ထည့်ခြင်း
function addChapter() {
    const div = document.createElement('div');
    div.className = 'chapter';
    div.innerHTML = `<h3 contenteditable="true">အခန်းခေါင်းစဉ်အသစ်</h3><div contenteditable="true">စာသားများ...</div><hr>`;
    editor.appendChild(div);
}

// ၃။ ပုံထည့်ခြင်း
document.getElementById('imgInput').addEventListener('change', function(e) {
    for (let file of e.target.files) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = document.createElement('img');
            img.src = event.target.result;
            img.style.maxWidth = "100%";
            editor.appendChild(img);
        };
        reader.readAsDataURL(file);
    }
});

// ၄။ အကုန်ဖျက်ခြင်း
function resetEditor() {
    if(confirm("အကုန်ဖျက်မှာ သေချာပြီလား?")) {
        editor.innerHTML = "";
        localStorage.removeItem('savedContent');
    }
}

// ၅။ ePub ထုတ်ခြင်း
async function generateEPUB() {
    const zip = new JSZip();
    zip.file("mimetype", "application/epub+zip");
    zip.file("META-INF/container.xml", '<?xml version="1.0" encoding="UTF-8"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>');
    
    let content = editor.innerHTML;
    const doc = new DOMParser().parseFromString(content, 'text/html');
    doc.querySelectorAll('img').forEach((img, i) => {
        const base64Data = img.src.split(',')[1];
        if (base64Data) {
            zip.file(`images/img_${i}.jpg`, base64Data, {base64: true});
            img.src = `images/img_${i}.jpg`;
        }
    });
    
    zip.file("content.opf", '<?xml version="1.0" encoding="UTF-8"?><package version="3.0" xmlns="http://www.id3.org/2007/opf" unique-identifier="pub-id"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:title>My Book</dc:title><dc:language>my</dc:language></metadata><manifest><item id="t1" href="index.html" media-type="application/xhtml+xml"/></manifest><spine><itemref idref="t1"/></spine></package>');
    zip.file("index.html", `<html><body>${doc.body.innerHTML}</body></html>`);
    zip.generateAsync({type:"blob"}).then(blob => saveAs(blob, "MyBook.epub"));
}
