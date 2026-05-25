// ၁။ ပုံရွေးပြီးတာနဲ့ Editor ထဲရောက်အောင်လုပ်ခြင်း
document.getElementById('imgInput').addEventListener('change', function(e) {
    const files = e.target.files;
    for (let file of files) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = document.createElement('img');
            img.src = event.target.result;
            img.style.maxWidth = '100%';
            document.getElementById('editor').appendChild(img);
        };
        reader.readAsDataURL(file);
    }
});

// ၂။ ePub ဖိုင်အဖြစ် ပြောင်းလဲခြင်း
async function generateEPUB() {
    const zip = new JSZip();
    const editorContent = document.getElementById('editor').innerHTML;
    
    // ပုံတွေကို သီးသန့်ဖိုင်တွေဖြစ်အောင် ခွဲထုတ်ခြင်း
    const parser = new DOMParser();
    const doc = parser.parseFromString(editorContent, 'text/html');
    const images = doc.querySelectorAll('img');
    
    for (let i = 0; i < images.length; i++) {
        const img = images[i];
        const base64Data = img.src.split(',')[1];
        const filename = `images/image_${i}.png`;
        
        // Zip ထဲကို ပုံသိမ်း
        zip.file(filename, base64Data, {base64: true});
        // HTML ထဲက path ကို ပြောင်း
        img.src = filename;
    }
    
    // စာသားကို HTML ဖိုင်အဖြစ် Zip ထဲထည့်
    zip.file("index.html", `<html><body>${doc.body.innerHTML}</body></html>`);
    
    // ePub ထုတ်ပေးခြင်း
    zip.generateAsync({type:"blob"}).then(function(content) {
        saveAs(content, "MyBook.epub");
    });
}
