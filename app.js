// ပုံထည့်သည့် လုပ်ဆောင်ချက်
document.getElementById('imgInput').addEventListener('change', function(e) {
    const files = e.target.files;
    for (let file of files) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = document.createElement('img');
            img.src = event.target.result;
            document.getElementById('editor').appendChild(img);
        };
        reader.readAsDataURL(file);
    }
});

// ePub ထုတ်သည့် လုပ်ဆောင်ချက်
async function generateEPUB() {
    const zip = new JSZip();
    const editorContent = document.getElementById('editor').innerHTML;
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(editorContent, 'text/html');
    const images = doc.querySelectorAll('img');
    
    images.forEach((img, index) => {
        const base64Data = img.src.split(',')[1];
        const filename = `images/img_${index}.png`;
        zip.file(filename, base64Data, {base64: true});
        img.src = filename;
    });
    
    zip.file("index.html", `<html><body>${doc.body.innerHTML}</body></html>`);
    
    zip.generateAsync({type:"blob"}).then(function(content) {
        saveAs(content, "MyBook.epub");
    });
}
