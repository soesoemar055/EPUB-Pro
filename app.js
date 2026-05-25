const editor = document.getElementById('editor');

// ၁။ Auto-save စနစ်
editor.addEventListener('input', () => localStorage.setItem('savedContent', editor.innerHTML));
window.onload = () => {
    const saved = localStorage.getItem('savedContent');
    if (saved) editor.innerHTML = saved;
};

// ၂။ အခန်းခွဲစနစ်
function addChapter() {
    const chapter = document.createElement('div');
    chapter.className = 'chapter';
    chapter.style.border = "1px dashed #999";
    chapter.style.margin = "10px 0";
    chapter.innerHTML = `<h3 contenteditable="true">အခန်းခေါင်းစဉ်</h3><div contenteditable="true">စာသားများ...</div>`;
    editor.appendChild(chapter);
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

// ၄။ Reset လုပ်ခြင်း
function resetEditor() {
    if(confirm("အကုန်ဖျက်မှာ သေချာပြီလား?")) {
        editor.innerHTML = "";
        localStorage.removeItem('savedContent');
    }
}

// ၅။ ePub ထုတ်ခြင်း
async function generateEPUB() {
    const zip = new JSZip();
    const content = editor.innerHTML;
    const doc = new DOMParser().parseFromString(content, 'text/html');
    
    doc.querySelectorAll('img').forEach((img, i) => {
        const base64Data = img.src.split(',')[1];
        const filename = `images/img_${i}.jpg`;
        zip.file(filename, base64Data, {base64: true});
        img.src = filename;
    });
    
    zip.file("index.html", `<html><body>${doc.body.innerHTML}</body></html>`);
    zip.generateAsync({type:"blob"}).then(blob => saveAs(blob, "MyBook.epub"));
}
