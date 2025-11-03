(function() {
    // תיקון הנתיבים - הסרת /src מתחילת הנתיב
    const images = [
        'images/08d98f70-4f90-4231-9bf5-7787d9889be1.jpg',
        'images/images.jpeg',
        'images/14.jpg',
        'images/3414.jpg',
        'images/AdobeStock_297116994.jpg',
        'images/AdobeStock_391381000.jpg',
        'images/AdobeStock_211553771750.jpg',
        'images/dc62cb6c-03a7-47f4-843d-572365e9f183.jpg',
        'images/images (1).jpeg',
        'images/images.jpeg',

    ];

    let currentSlide = 0;
    const slider = document.querySelector('.slider');

    function createSlides() {
        if (!slider) {
            console.error('Slider element not found');
            return;
        }

        // ניקוי הסליידר לפני הוספת סליידים חדשים
        slider.innerHTML = '';

        // יצירת כל הסליידים בבת אחת
        images.forEach((imgPath, index) => {
            const slide = document.createElement('div');
            slide.className = `slide ${index === 0 ? 'active' : ''}`;
            
            // הסרת תמונת הגיבוי והוספת לוג ברור יותר
            const img = new Image();
            img.onload = () => {
                console.log(`נטענה בהצלחה: ${imgPath}`);
                slide.style.backgroundImage = `url('${imgPath}')`;
            };
            img.onerror = () => {
                console.error(`שגיאה בטעינת תמונה: ${imgPath}`);
                // לא מוסיפים תמונת גיבוי
            };
            img.src = imgPath;
            
            slider.appendChild(slide);
        });
    }

    // מעבר לסלייד הבא
    function nextSlide() {
        const slides = document.querySelectorAll('.slide');
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    // מעבר לסלייד הקודם
    function prevSlide() {
        const slides = document.querySelectorAll('.slide');
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    // שיפור פונקציית האתחול
    function init() {
        try {
            createSlides();
            
            const prevBtn = document.querySelector('.prev-btn');
            const nextBtn = document.querySelector('.next-btn');
            
            if (prevBtn && nextBtn) {
                prevBtn.addEventListener('click', prevSlide);
                nextBtn.addEventListener('click', nextSlide);
                
                // שינוי המהירות ל-2 שניות במקום 5
                if (document.querySelectorAll('.slide').length > 0) {
                    setInterval(nextSlide, 2000);
                }
            }
        } catch (error) {
            console.error('Initialization error:', error);
        }
    }

    // הפעלה כשהדף נטען
    document.addEventListener('DOMContentLoaded', init);
})();