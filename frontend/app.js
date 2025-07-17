document.addEventListener('DOMContentLoaded', function () {
    // عناصر DOM
    const wordInput = document.getElementById('wordInput');
    const langSelect = document.getElementById('langSelect');
    const searchBtn = document.getElementById('searchBtn');
    const clearBtn = document.getElementById('clearBtn');
    const resultsContainer = document.getElementById('resultsContainer');
    const meaningsContainer = document.getElementById('meaningsContainer');
    const resultWord = document.getElementById('resultWord');
    const resultLang = document.getElementById('resultLang');
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    const historyContainer = document.getElementById('historyContainer');
    const historyList = document.getElementById('historyList');
    const searchSpinner = document.getElementById('searchSpinner');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');

    const API_BASE = '/api'; // آدرس بک‌اند

    // تاریخچه جستجو از localStorage
    let searchHistory = JSON.parse(localStorage.getItem('dictionaryHistory')) || [];

    // رویدادها
    wordInput.addEventListener('input', toggleClearButton);
    clearBtn.addEventListener('click', clearInput);
    searchBtn.addEventListener('click', searchWord);
    wordInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') searchWord();
    });
    clearHistoryBtn.addEventListener('click', clearHistory);

    // نمایش تاریخچه در صورت وجود
    if (searchHistory.length > 0) {
        renderHistory();
        historyContainer.classList.remove('hidden');
    }

    // توابع
    function toggleClearButton() {
        if (wordInput.value.trim() !== '') {
            clearBtn.classList.remove('hidden');
        } else {
            clearBtn.classList.add('hidden');
        }
    }

    function clearInput() {
        wordInput.value = '';
        clearBtn.classList.add('hidden');
        wordInput.focus();
    }

    async function searchWord() {
        const word = wordInput.value.trim();
        const lang = langSelect.value;

        if (!word) {
            showError('لطفاً یک کلمه وارد کنید');
            return;
        }

        // نمایش اسپینر
        searchBtn.disabled = true;
        searchSpinner.classList.remove('hidden');

        try {
            // پاک کردن نتایج قبلی
            hideResults();
            hideError();

            // درخواست به بک‌اند
            const response = await fetch(`${API_BASE}/lookup?word=${encodeURIComponent(word)}&lang=${lang}`);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'خطا در دریافت اطلاعات');
            }

            const data = await response.json();
            displayResults(data);

            // افزودن به تاریخچه
            addToHistory(word, lang);

        } catch (error) {
            console.error('Error:', error);
            showError(error.message);
        } finally {
            // مخفی کردن اسپینر
            searchBtn.disabled = false;
            searchSpinner.classList.add('hidden');
        }
    }

    function displayResults(data) {
        resultWord.textContent = data.word;
        resultLang.textContent = data.lang === 'en' ? 'انگلیسی به فارسی' : 'فارسی به انگلیسی';

        // پاک کردن معانی قبلی
        meaningsContainer.innerHTML = '';

        // افزودن معانی جدید
        if (data.meanings && data.meanings.length > 0) {
            data.meanings.forEach((item, index) => {
                const meaningElement = document.createElement('div');
                meaningElement.className = 'border-l-4 border-blue-500 pl-4';
                meaningElement.innerHTML = `
                    <div class="flex items-start">
                        <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">${index + 1}</span>
                        <div>
                            <p class="text-gray-800 font-medium">${item.meaning}</p>
                            <p class="text-gray-500 text-sm mt-1">مثال: <span class="text-gray-700">${item.example}</span></p>
                        </div>
                    </div>
                `;
                meaningsContainer.appendChild(meaningElement);
            });
        } else {
            showError('معنی یافت نشد');
            return;
        }

        // نمایش نتایج
        resultsContainer.classList.remove('hidden');
    }

    function hideResults() {
        resultsContainer.classList.add('hidden');
    }

    function showError(message) {
        errorText.textContent = message;
        errorMessage.classList.remove('hidden');
        resultsContainer.classList.remove('hidden');
    }

    function hideError() {
        errorMessage.classList.add('hidden');
    }

    function addToHistory(word, lang) {
        // جلوگیری از تکرار
        const existingIndex = searchHistory.findIndex(item =>
            item.word === word && item.lang === lang
        );

        if (existingIndex !== -1) {
            searchHistory.splice(existingIndex, 1);
        }

        // افزودن به ابتدای آرایه
        searchHistory.unshift({
            word,
            lang,
            timestamp: new Date().toISOString()
        });

        // محدود کردن تاریخچه به 10 آیتم
        if (searchHistory.length > 10) {
            searchHistory.pop();
        }

        // ذخیره در localStorage
        localStorage.setItem('dictionaryHistory', JSON.stringify(searchHistory));

        // رندر مجدد تاریخچه
        renderHistory();
        historyContainer.classList.remove('hidden');
    }

    function renderHistory() {
        historyList.innerHTML = '';

        searchHistory.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'bg-white p-3 rounded-lg shadow-sm border border-gray-200 hover:border-blue-300 cursor-pointer transition';
            historyItem.innerHTML = `
                <div class="flex justify-between items-start">
                    <span class="font-medium text-gray-800">${item.word}</span>
                    <span class="text-xs px-2 py-1 rounded-full ${item.lang === 'en' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}">
                        ${item.lang === 'en' ? 'en→fa' : 'fa→en'}
                    </span>
                </div>
                <div class="text-xs text-gray-500 mt-2">${new Date(item.timestamp).toLocaleString('fa-IR')}</div>
            `;

            historyItem.addEventListener('click', () => {
                wordInput.value = item.word;
                langSelect.value = item.lang;
                searchWord();
            });

            historyList.appendChild(historyItem);
        });
    }

    function clearHistory() {
        searchHistory = [];
        localStorage.removeItem('dictionaryHistory');
        historyList.innerHTML = '';
        historyContainer.classList.add('hidden');
        showToast('تاریخچه جستجو پاک شد');
    }

    function showToast(message) {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');

        toastMessage.textContent = message;
        toast.classList.remove('hidden');

        setTimeout(() => {
            toast.classList.add('hidden');
        }, 3000);
    }
});