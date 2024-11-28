

const profilePic = document.getElementById('profilePic');
const fileInput = document.getElementById('fileInput');

// عند تحميل الصفحة، تحقق من وجود صورة في Local Storage
window.addEventListener('DOMContentLoaded', () => {
  const savedImage = localStorage.getItem('profilePic');
  if (savedImage) {
    profilePic.src = savedImage; // عرض الصورة المحفوظة
  }
});

// عند النقر على صورة الملف الشخصي
profilePic.addEventListener('click', () => {
  fileInput.click();
});

// عند اختيار صورة جديدة
fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target.result;
      profilePic.src = imageData; // عرض الصورة الجديدة
      localStorage.setItem('profilePic', imageData); // حفظ الصورة في Local Storage
      alert('تم تحديث صورة الملف الشخصي بنجاح!');
    };
    reader.readAsDataURL(file); // تحويل الصورة إلى Base64
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const imageInput = document.getElementById('imageInput');
  const imageName = document.getElementById('imageName');
  const addImageBtn = document.getElementById('addImageBtn');
  const imageGallery = document.getElementById('imageGallery');

  // مصفوفة لتخزين الصور
  const savedImages = JSON.parse(localStorage.getItem('images')) || [];

  // إنشاء عنصر div للصورة
  const createImageDiv = (imageData) => {
    const { name, url, likes, id } = imageData;  // أضفنا id لتحديد الصورة بشكل فريد

    const newDiv = document.createElement('div');
    newDiv.classList.add('profile-container');
    newDiv.innerHTML = `
        <h3 class="type">${name}</h3>
        <img class="ci" src="${url}" alt="${name}">
        <div class="buttons-container">
            <i class="fa fa-thumbs-up like-icon" data-id="${id}"></i>
            <span class="like-count">${likes}</span>
            <i class="fa fa-download download-icon"></i>
        </div>
    `;

    // إضافة أحداث زر الإعجاب
    const likeIcon = newDiv.querySelector('.like-icon');
    const likeCount = newDiv.querySelector('.like-count');
    likeIcon.addEventListener('click', () => {
      // تحقق من إذا كان المستخدم قد أعجب بالصورة بالفعل
      if (!localStorage.getItem(`liked_${id}`)) {
        imageData.likes++;
        likeCount.textContent = imageData.likes;
        localStorage.setItem(`liked_${id}`, true); // حفظ حالة الإعجاب في localStorage
        saveImagesToLocalStorage();
      } else {
        alert('لقد قمت بالإعجاب بهذه الصورة من قبل!');
      }
    });


    // إضافة أحداث زر التحميل
    const downloadIcon = newDiv.querySelector('.download-icon');
    downloadIcon.addEventListener('click', (e) => {
      e.stopPropagation();
      const link = document.createElement('a');
      link.href = url;
      link.download = `${name}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });

    imageGallery.appendChild(newDiv);
  };

  // حفظ الصور في LocalStorage
  const saveImagesToLocalStorage = () => {
    localStorage.setItem('images', JSON.stringify(savedImages));
  };

  // عرض الصور المحفوظة عند تحميل الصفحة
  savedImages.forEach(createImageDiv);

  // إضافة صورة جديدة عند الضغط على زر "إضافة الصورة"
  addImageBtn.addEventListener('click', () => {
    const file = imageInput.files[0];
    const name = imageName.value.trim();

    if (file && name) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // إنشاء عنصر Canvas لتغيير حجم الصورة
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          // تحديد أبعاد الصورة الجديدة
          const MAX_WIDTH = 600; // الحد الأقصى للعرض
          const MAX_HEIGHT = 400; // الحد الأقصى للطول
          let width = img.width;
          let height = img.height;

          // إذا كانت الصورة أكبر من الحجم المحدد، قم بتقليصها
          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round(height * (MAX_WIDTH / width));
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round(width * (MAX_HEIGHT / height));
              height = MAX_HEIGHT;
            }
          }

          // تعيين أبعاد الصورة في Canvas
          canvas.width = width;
          canvas.height = height;

          // رسم الصورة في الـ Canvas
          ctx.drawImage(img, 0, 0, width, height);

          // تحويل الصورة إلى Base64
          const compressedImage = canvas.toDataURL('image/jpeg', 0.7); // تقليل الجودة لتقليل الحجم

          // إنشاء معرف فريد للصورة
          const imageId = `image_${new Date().getTime()}`;  // استخدم الوقت كمعرف فريد

          const newImage = { name, url: compressedImage, likes: 0, id: imageId };
          savedImages.push(newImage);
          saveImagesToLocalStorage();
          createImageDiv(newImage);

          // تنظيف الحقول
          imageInput.value = '';
          imageName.value = '';
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);  // قراءة الملف كـ Base64
    } else {
      alert('يرجى تحميل صورة وإدخال اسمها!');
    }
  });
});


document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  const imageGallery = document.getElementById('imageGallery');

  // وظيفة البحث
  searchInput.addEventListener('input', () => {
    const searchText = searchInput.value.toLowerCase(); // النص الذي أدخله المستخدم
    const imageDivs = imageGallery.getElementsByClassName('profile-container');

    // تصفية الصور بناءً على العنوان
    Array.from(imageDivs).forEach((div) => {
      const title = div.querySelector('.type').textContent.toLowerCase(); // عنوان الصورة
      if (title.includes(searchText)) {
        div.style.display = 'inline-block'; // عرض الصورة إذا كانت مطابقة
      } else {
        div.style.display = 'none'; // إخفاء الصورة إذا لم تكن مطابقة
      }
    });
  });
});
//////////////


// عند تحميل الصفحة، تحقق من وجود البريد الإلكتروني في localStorage
window.addEventListener('DOMContentLoaded', () => {
  const savedEmail = localStorage.getItem('userEmail');
  if (savedEmail) {
    alert(`Welcome back, ${savedEmail}`);
  } else {
    const email = prompt('Please enter your email:');
    if (email) {
      localStorage.setItem('userEmail', email);
    }
  }
});

addImageBtn.addEventListener('click', () => {
  const file = imageInput.files[0];
  const name = imageName.value.trim();

  if (file && name) {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('name', name);

    // إرسال الصورة إلى الخادم باستخدام Fetch
    fetch('/upload-image', { // مسار الـ API الذي سيعالج رفع الصورة
      method: 'POST',
      body: formData,
    })
    .then(response => response.json())
    .then(data => {
      const imageData = {
        name,
        url: data.imageUrl, // رابط الصورة التي تم رفعها
        likes: 0,
      };
      savedImages.push(imageData);
      saveImagesToLocalStorage();
      createImageDiv(imageData);
    })
    .catch(error => alert('Error uploading image: ' + error));
  } else {
    alert('Please select an image and enter its name.');
  }
});



document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modal');
  const modalImage = document.getElementById('modalImage');
  const captionText = document.getElementById('caption');
  const closeBtn = document.getElementsByClassName('close')[0];

  // إضافة حدث للنقر على الصورة لفتحها في النافذة المنبثقة
  document.getElementById('imageGallery').addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains('ci')) {
      modal.style.display = 'block';  // إظهار النافذة المنبثقة
      modalImage.src = e.target.src; // تعيين مصدر الصورة في النافذة المنبثقة
      captionText.innerHTML = e.target.alt; // تعيين النص التوضيحي
    }
  });

  // إغلاق النافذة عند النقر على زر الإغلاق
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // إغلاق النافذة عند النقر في أي مكان خارج الصورة
  window.addEventListener('click', (e) => {
    if (e.target == modal) {
      modal.style.display = 'none';
    }
  });
});













