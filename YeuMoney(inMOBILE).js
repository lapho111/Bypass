// ==UserScript==
// @name         Yeumoney 88
// @namespace    http://tampermonkey.net/
// @description  Bypass Yeumoney
// @author       LapHo
// @match        https://yeumoney.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-end
// @icon         https://raw.githubusercontent.com/lapho111/Bypass/b0c909d429d21e2653fe8d50d289219563d9ccf6/Logo.jpeg
// ==/UserScript==

(function() {
    'use strict';
    const GET_VUATRAFFIC_URL = "https://traffic-user.net/GET_VUATRAFFIC.php";
    const GET_MA_URL = "https://traffic-user.net/GET_MA.php";
    const GOOGLE_URL = "https://www.google.com/";
    const OCR_URL = "https://api.ocr.space/parse/imageurl?apikey=K81664733488957&isOverlayRequired=true&OCREngine=2";
    function doiNhiemvu() {
        console.log("Đang đổi nhiệm vụ...");
        const btnBaoloi = document.querySelector('#btn-baoloi');
        if (!btnBaoloi) return;
        btnBaoloi.click();
        setTimeout(() => {
            const reasonLink = document.querySelector('#lydo_doima > center > a:nth-child(2)');
            if (reasonLink) reasonLink.click();
            setTimeout(() => {
                const radioInput = document.querySelector('#lydo_doima > label:nth-child(8) > input[type=radio]');
                if (radioInput) radioInput.click();
                setTimeout(() => {
                    const confirmLink = document.querySelector('#dongy_doima > a');
                    if (confirmLink) confirmLink.click();
                }, 500);
            }, 500);
        }, 500);
    }
    function recognizeTrafficURL() {
        return new Promise((resolve, reject) => {
            const trafficName = document.querySelector('p#TK1').textContent.trim().toLowerCase();
            const imageElement = document.querySelector('img#halt_nv') || document.querySelector('img#hinh_nv');
            const imageUrl = imageElement ? imageElement.src : null;
            if (imageUrl.includes('placehold.co')) {
                setTimeout(() => {
                    recognizeTrafficURL().then(resolve).catch(reject);
                }, 100);
                return;
            }
            const fetchUrl = `${OCR_URL}&url=${imageUrl}`;
            const xhr = new XMLHttpRequest();
            xhr.open("GET", fetchUrl, true);
            xhr.onload = function() {
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    const parsedResult = response.ParsedResults[0];
                    const result = parsedResult.TextOverlay.Lines
                        .filter(line => line.LineText.match(/\b[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+\b/) &&
                            line.Words &&
                            line.Words.some(word => word.Top < 170))
                        .map(line => line.LineText);
                    let taskURL = '';
                    if (trafficName === '188bet') {
                        taskURL = `https://165.22.63.250/`;
                    } else if (trafficName === 'w88') {
                        taskURL = `https://188.166.185.213/`;
                    } else if (trafficName === 'bk8') {
                        taskURL = `https://bk8${result}/`;
                    } else if (trafficName === 'fb88') {
                        taskURL = `https://fb88${result}/`;
                    } else if (trafficName === 'm88') {
                        taskURL = `https://bet88${result}/`;
                    } else if (trafficName === 'vn88') {
                        taskURL = `https://vn88${result}/`;
                    } else if (trafficName === 'v9bet') {
                        taskURL = `https://v9bet${result}/`;
                    } else {
                        taskURL = `Chưa nhận diện được URL!`;
                    }
                    resolve(taskURL);
                } else {
                    reject('Lỗi khi tải dữ liệu: ' + xhr.status);
                }
            };
            xhr.send();
        });
    }
    function generateTimestampData(taskURL) {
        const timestamp = Date.now();
        return `${timestamp},${GOOGLE_URL},${taskURL},IOS900,hidden,null`;
    }
    function fetchCodexn(ymnclk) {
        return new Promise((resolve, reject) => {
            const timestampData = generateTimestampData();
            const xhr = new XMLHttpRequest();
            const fetchUrl = `${GET_VUATRAFFIC_URL}?data=${timestampData}&clk=${ymnclk}`;
            xhr.open("POST", fetchUrl, true);
            xhr.onload = function() {
                if (xhr.status === 200) {
                    const htmlString = xhr.responseText;
                    const codexn = htmlString.match(/localStorage\.codexn\s*=\s*'([^']+)'/)?.[1];
                    if (codexn) {
                        localStorage.codexn = codexn;
                        resolve(codexn);
                    } else {
                        console.error("Không thể lấy mã codexn");
                        reject("Lỗi! Đổi nhiệm vụ khác và thử lại");
                    }
                } else {
                    reject(`Lỗi: ${xhr.status}`);
                }
            };
            xhr.onerror = () => reject("Lỗi mạng hoặc yêu cầu không thành công");
            xhr.send();
        });
    }
    function fetchCode(codexn, url, loai_traffic, ymnclk) {
        return new Promise((resolve, reject) => {
            const fetchUrl = `${GET_MA_URL}?codexn=${codexn}&url=${url}&loai_traffic=${loai_traffic}&clk=${ymnclk}`;
            const xhr = new XMLHttpRequest();
            xhr.open("POST", fetchUrl, true);
            xhr.onload = function() {
                if (xhr.status === 200) {
                    const htmlString = xhr.responseText;
                    const ymnclk = htmlString.match(/sessionStorage\.setItem\("ymnclk", (\d+)\)/)?.[1];
                    if (ymnclk) {
                        sessionStorage.setItem("ymnclk", ymnclk);
                        resolve(ymnclk);
                    } else {
                        const doc = new DOMParser().parseFromString(htmlString, 'text/html');
                        const spanElement = doc.querySelector('span#layma_me_vuatraffic');
                        if (spanElement) resolve(spanElement.textContent.trim());
                        else reject("URL Lỗi! Vui lòng kiểm tra lại.");
                    }
                } else {
                    reject(`Lỗi: ${xhr.status}`);
                }
            };
            xhr.onerror = () => reject("Lỗi mạng hoặc yêu cầu không thành công");
            xhr.send();
        });
    }
    function fetchResult(code) {
        const actionValue = document.querySelector('#gt-form')?.getAttribute('action') || '';
        const url = `https://yeumoney.com${actionValue}`;
        const formData = new FormData();
        formData.append('code', code);
        formData.append('keyword', '');
        formData.append('dieuhanh', document.querySelector('input[name="dieuhanh"]')?.value || '');
        formData.append('pix', document.querySelector('input[name="pix"]')?.value || '');
        formData.append('lvp', document.querySelector('input[name="lvp"]')?.value || '');
        formData.append('ref', '$ref');
        formData.append('trinhduyet', document.getElementById('trinhduyet')?.value || '');
        formData.append('id_traffic', document.getElementById('id_donhang')?.value || '');
        formData.append('check_index', '1');
        const urlEncodedData = new URLSearchParams(formData).toString();
        GM_xmlhttpRequest({
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': navigator.userAgent,
                'Referer': 'https://yeumoney.com/',
                'Cookie': document.cookie
            },
            data: urlEncodedData,
            onload: function(response) {
                window.location.href = response.finalUrl;
            },
            onerror: function(error) {
                const errorFetch = error.error;
                const url = errorFetch.match(/https?:\/\/[^\s"]+/);
                window.location.href = url;
            }
        });
    }
    async function startBypass(url) {
        try {
            const codexn1 = await fetchCodexn(null);
            const url1 = url.replace(/\/$/, "");
            const ymnclk = await fetchCode(codexn1, url1, GOOGLE_URL, null);
            const codexn2 = await fetchCodexn(ymnclk);
            const url2 = url + "admin";
            const result = await fetchCode(codexn2, url2, url, ymnclk);
            return result;
        } catch (error) {
            console.error("Lỗi trong startBypass:", error);
            return null;
        }
    }
    async function fetchGoogleSheetHyperlinks() {
        try {
            const today = new Date();
            const day = today.getDate().toString();
            const spanElement =
                document.getElementById('docs-title-input-label-inner') ||
                document.querySelector('.docs-ml-header-document-title-text');
            const spanText = spanElement.textContent || spanElement.innerText;
            if (!spanText.includes("TÌM MÃ BƯỚC 2")) {
                const storedDate = localStorage.getItem("dayBypassed");
                if (storedDate === day) {
                    console.log("Đã bypass hôm nay.");
                    return null;
                }
                if (spanText.includes("BACKUP KHÓA HỌC 2K7 FREE")) {
                    const userConfirmed = confirm("Bạn có muốn Bypass không?!");
                    if (!userConfirmed) {
                        localStorage.setItem("dayBypassed", day);
                        return null;
                    }
                } else {
                    return null;
                }
            }
            localStorage.setItem("dayBypassed", day);
            const sheetUrl = window.location.href;
            const apiKey = "AIzaSyDTEFhPROUdMvEg7pTPF13rTRCfgXbJLJo";
            const sheetId = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];
            if (!sheetId) {
                console.error("Không tìm thấy Sheet ID.");
                return null;
            }
            const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?fields=sheets(data(rowData(values(userEnteredValue,hyperlink))))&key=${apiKey}`;
            const response = await fetch(apiUrl);
            if (!response.ok) {
                console.error("Lỗi khi gọi API:", response.statusText);
                return null;
            }
            const data = await response.json();
            const sheetData = data.sheets?.[0]?.data?.[0]?.rowData || [];
            for (let row of sheetData) {
                for (let cell of row.values || []) {
                    const hyperlink = cell.hyperlink;
                    if (hyperlink && relying.includes('https://yeumoney.com/')) {
                        return hyperlink;
                    }
                }
            }
            console.warn("Không tìm thấy hyperlink hợp lệ.");
            return null;
        } catch (error) {
            console.error("Lỗi:", error.message);
            return null;
        }
    }
    async function completeGoogleForms() {
        if (!document.title.includes("Điểm danh ngày")) {
            return null;
        }
        window.onbeforeunload = null;
        function clickCheckbox(checkbox, delay) {
            setTimeout(() => {
                if (!checkbox.classList.contains('checked')) {
                    checkbox.click();
                }
            }, delay);
        }
        function clickRadio(radio, delay) {
            setTimeout(() => {
                if (!radio.classList.contains('checked')) {
                    radio.click();
                }
            }, delay);
        }
        var checkboxes = document.querySelectorAll('div[role="checkbox"]');
        checkboxes.forEach((checkbox, index) => {
            clickCheckbox(checkbox, index * 300);
        });
        var radioGroups = document.querySelectorAll('div[role="radiogroup"]');
        radioGroups.forEach(group => {
            var radioButtons = group.querySelectorAll('div[role="radio"]');
            radioButtons.forEach((radio, index) => {
                clickRadio(radio, index * 300);
            });
        });
        setTimeout(() => {
            var form = document.querySelector('form');
            if (form) {
                form.submit();
            }
        }, (checkboxes.length + radioGroups.length) * 300 + 200);
    }
    function createUI(taskURL) {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.height = '200px';
        container.style.bottom = '20px';
        container.style.left = '20px';
        container.style.backgroundColor = '#000000';
        container.style.border = '1px solid #444';
        container.style.padding = '0';
        container.style.zIndex = '9999';
        container.style.width = '93%';
        container.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.5)';
        container.style.borderRadius = '50%';
        container.style.transform = 'scale(0.142)';
        container.style.transformOrigin = '0 100%';
        container.style.transition = 'transform 0.4s ease-in-out, border-radius 0.4s ease-in-out, bottom 0.4s ease-in-out, left 0.4s ease-in-out, box-shadow 0.4s ease-in-out, padding 0.4s ease-in-out';
        document.body.appendChild(container);
        setTimeout(() => {
            container.style.transform = 'translateX(-50%)';
            container.style.borderRadius = '15px';
            container.style.bottom = '0px';
            container.style.left = '50%';
            container.style.boxShadow = '0px 4px 6px rgba(0,0,0,0.1)';
            container.style.padding = '10px';
            container.style.height = 'auto';
        }, 10);
        const closeBtn = document.createElement('button');
        closeBtn.style.position = 'absolute';
        closeBtn.style.top = '5px';
        closeBtn.style.right = '5px';
        closeBtn.style.backgroundColor = 'transparent';
        closeBtn.style.border = 'none';
        closeBtn.style.borderRadius = '100%';
        closeBtn.style.width = '25px';
        closeBtn.style.height = '25px';
        closeBtn.style.display = 'flex';
        closeBtn.style.alignItems = 'center';
        closeBtn.style.justifyContent = 'center';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.3)';
        const closeIcon = document.createElement('img');
        closeIcon.src = 'https://raw.githubusercontent.com/lapho111/Bypass/refs/heads/main/IMG_3520.webp';
        closeIcon.style.width = '15px';
        closeIcon.style.height = '15px';
        closeIcon.onerror = () => {
            console.error('Không thể tải icon từ URL. Thay thế bằng chữ "X".');
            closeBtn.textContent = 'X';
            closeBtn.style.color = '#ffffff';
        };
        closeBtn.appendChild(closeIcon);
        closeBtn.onclick = (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (container && container.parentNode) {
                container.remove();
            }
        };
        container.appendChild(closeBtn);
        let isMinimized = false;
        closeBtn.onclick = (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (!isMinimized) {
                container.style.transition = 'transform 0.4s ease-in-out,border-radius, opacity 0.4s ease-in-out,bottom 0.4s  , left 0.4s ease-in-out';
                container.style.transform = 'scale(0.142)';
                container.style.transformOrigin = '0 100%';
                container.style.borderRadius = '80%';
                container.style.backgroundImage = 'url(https://raw.githubusercontent.com/lapho111/Bypass/refs/heads/main/Logo.jpeg)';
                container.style.backgroundSize = 'cover';
                container.style.backgroundPosition = 'center';
                container.style.bottom = '20px';
                container.style.left = '20px';
                container.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 5)';
                container.style.padding = '0';
                container.style.width = '400px';
                container.style.height = '400px';
                container.querySelectorAll('*').forEach(child => {
                    if (child !== closeBtn) {
                        child.dataset.originalDisplay = child.style.display || window.getComputedStyle(child).display;
                        child.style.transition = 'opacity 0s ease-in-out';
                        child.style.opacity = '0';
                        setTimeout(() => {
                            child.style.display = 'none';
                        }, 0.1);
                    }
                });
                closeBtn.style.width = '100%';
                closeBtn.style.height = '100%';
                closeBtn.style.top = '0';
                closeBtn.style.right = '0';
                closeBtn.style.zIndex = '10000';
                closeBtn.style.pointerEvents = 'auto';
                isMinimized = true;
            } else {
                container.style.transition = 'transform 0.4s ease-in-out, border-radius 0.4s ease-in-out, bottom 0.4s ease-in-out, left 0.4s ease-in-out, box-shadow 0.4s ease-in-out, padding 0.4s ease-in-out';
                container.style.transform = 'translateX(-50%)';
                container.style.borderRadius = '15px';
                container.style.backgroundColor = '#000000';
                container.style.bottom = '0px';
                container.style.left = '50%';
                container.style.boxShadow = '0px 4px 6px rgba(0,0,0,0.1)';
                container.style.padding = '10px';
                container.style.width = '93%';
                container.style.height = 'auto';
                container.style.backgroundImage = 'none';
                container.querySelectorAll('*').forEach(child => {
                    if (child !== closeBtn) {
                        child.style.display = child.dataset.originalDisplay || 'block';
                        child.style.transition = 'opacity 0s ease-in-out';
                        child.style.opacity = '0';
                        setTimeout(() => {
                            child.style.opacity = '1';
                        }, 10);
                    }
                });
                closeBtn.style.width = '25px';
                closeBtn.style.height = '25px';
                closeBtn.style.top = '5px';
                closeBtn.style.right = '5px';
                closeBtn.style.display = 'flex';
                closeBtn.style.alignItems = 'center';
                closeBtn.style.justifyContent = 'center';
                closeBtn.style.zIndex = '10000';
                closeBtn.style.pointerEvents = 'auto';
                closeBtn.style.backgroundColor = 'transparent';
                closeBtn.style.border = 'none';
                closeBtn.style.borderRadius = '50%';
                closeBtn.style.cursor = 'pointer';
                closeBtn.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.3)';
                const closeIcon = closeBtn.querySelector('img');
                if (closeIcon) {
                    closeIcon.style.width = '15px';
                    closeIcon.style.height = '15px';
                    closeIcon.style.display = 'block';
                }
                isMinimized = false;
            }
        };
        const des = document.createElement('a');
        des.textContent = 'Welcome To Lạp Hộ';
        des.style.margin = '0';
        des.style.marginBottom = '10px';
        des.style.fontSize = '10px';
        des.style.fontStyle = 'italic';
        des.style.textAlign = 'center';
        des.style.display = ' block';
        des.style.backgroundImage = 'linear-gradient(90deg, red, orange, brown, green, blue, indigo, violet, indigo, blue, green, brown, orange, red)';
        des.style.backgroundSize = '200% auto';
        des.style.color = '#ffffff';
        des.style.backgroundClip = 'text';
        des.style.webkitBackgroundClip = 'text';
        des.style.animation = 'rainbowMove 5s linear infinite';
        des.style.textDecoration = 'underline';
        des.href = 'https://www.facebook.com/lapho111';
        const style = document.createElement('style');
        style.textContent = `
@keyframes rainbowMove {
    0% {
        background-position: 0% 50%;
    }
    100% {
        background-position: 100% 50%;
    }
}
`;
        document.head.appendChild(style);
        container.appendChild(des);
        const title = document.createElement('h3');
        title.textContent = 'Bypass YeuMoney:';
        title.style.margin = '0';
        title.style.fontWeight = 'bold';
        title.style.marginBottom = '10px';
        title.style.fontSize = '25px';
        title.style.color = '#ffff00';
        title.style.textAlign = 'center';
        title.style.textShadow = '0 0 5px rgba(255, 255, 255, 0.7), 0 0 10px rgba(255, 255, 255, 0.6), 0 0 15px rgba(255, 255, 255, 0.5)';
        container.appendChild(title);
        const input = document.createElement('input');
        input.readOnly = false;
        input.placeholder = ' Để Yên URL Tự Nhập!';
        input.style.width = '100%';
        input.style.color = 'white';
        input.style.marginBottom = '10px';
        input.style.padding = '8px';
        input.style.paddingLeft = '15px';
        input.style.borderRadius = '30px';
        input.style.fontSize = '14px';
        input.style.backgroundColor = 'black';
        container.appendChild(input);
        const url = document.createElement('h4');
        url.textContent = 'URL nhận diện (URL): ' + taskURL;
        url.style.margin = '0';
        url.style.marginBottom = '10px';
        url.style.fontSize = '13px';
        url.style.color = 'brown';
        container.appendChild(url);
        const checkboxRow = document.createElement('div');
        checkboxRow.style.display = 'flex';
        checkboxRow.style.alignItems = 'center';
        checkboxRow.style.marginBottom = '10px';
        checkboxRow.style.fontSize = '14px';
        checkboxRow.style.color = 'chocolate';
        const fetchCheckbox = document.createElement('input');
        fetchCheckbox.type = 'checkbox';
        fetchCheckbox.id = 'fetchCode';
        fetchCheckbox.checked = GM_getValue('fetchCode', false);
        fetchCheckbox.onchange = () => {
            GM_setValue('fetchCode', fetchCheckbox.checked);
        };
        const fetchLabel = document.createElement('label');
        fetchLabel.htmlFor = 'fetchCode';
        fetchLabel.textContent = 'Auto chuyển trang';
        fetchLabel.style.marginLeft = '5px';
        fetchLabel.style.marginRight = '15px';
        const fetchContainer = document.createElement('div');
        fetchContainer.style.display = 'flex';
        fetchContainer.style.alignItems = 'center';
        fetchContainer.appendChild(fetchCheckbox);
        fetchContainer.appendChild(fetchLabel);
        const autoStartCheckbox = document.createElement('input');
        autoStartCheckbox.type = 'checkbox';
        autoStartCheckbox.id = 'autoStart';
        autoStartCheckbox.checked = GM_getValue('autoStart', true);
        autoStartCheckbox.onchange = () => {
            GM_setValue('autoStart', autoStartCheckbox.checked);
        };
        const autoStartLabel = document.createElement('label');
        autoStartLabel.htmlFor = 'autoStart';
        autoStartLabel.textContent = 'Auto Bypass ';
        autoStartLabel.style.marginLeft = '5px';
        const autoStartContainer = document.createElement('div');
        autoStartContainer.style.display = 'flex';
        autoStartContainer.style.alignItems = 'center';
        autoStartContainer.appendChild(autoStartCheckbox);
        autoStartContainer.appendChild(autoStartLabel);
        checkboxRow.appendChild(fetchContainer);
        checkboxRow.appendChild(autoStartContainer);
        container.appendChild(checkboxRow);
        const buttonRow = document.createElement('div');
        buttonRow.style.display = 'flex';
        buttonRow.style.flexDirection = 'column';
        buttonRow.style.gap = '10px';
        buttonRow.style.fontSize = '14px';
        const startBtn = document.createElement('button');
        startBtn.textContent = 'Bypass';
        startBtn.style.flex = '1';
        startBtn.style.padding = '10px';
        startBtn.style.marginRight = '5px';
        startBtn.style.borderRadius = '30px';
        startBtn.style.border = 'none';
        startBtn.style.cursor = 'pointer';
        startBtn.style.backgroundColor = '#4B0082';
        startBtn.style.color = '#FFD700';
        startBtn.style.fontWeight = 'bold';
        startBtn.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.5)';
        startBtn.style.textShadow = '0 0 5px rgba(255, 255, 0, 0.8), 0 0 10px rgba(255, 255, 0, 0.6)';
        startBtn.style.border = '1px solid #FFD700';
        startBtn.style.boxSizing = 'border-box';
        startBtn.style.transition = 'all 0.2s ease-in-out';
        startBtn.addEventListener('touchstart', () => {
            startBtn.style.transform = 'translateY(4px)';
            startBtn.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.7)';
        });
        startBtn.addEventListener('touchend', () => {
            startBtn.style.transform = 'translateY(0)';
            startBtn.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.5)';
        });
        startBtn.onclick = async () => {
            try {
                startBtn.disabled = true;
                input.readOnly = true;
                const check = input.value || taskURL;
                input.value = 'Đang Lấy URL ...';
                const code = await startBypass(check);
                if (code) {
                    let countdown = 75;
                    const countdownInterval = setInterval(() => {
                        input.value = `Chờ: ${countdown}s Để Tránh Bị Reload  `;
                        countdown--;
                        if (countdown < 0) {
                            clearInterval(countdownInterval);
                            if (fetchCheckbox.checked) {
                                const codeInputField = document.querySelector('input[placeholder="Nhập mã vào đây"]');
                                const confirmButton = Array.from(document.querySelectorAll('button')).find(button => button.textContent.trim() === 'Xác nhận');
                                if (codeInputField && confirmButton) {
                                    const closeButton = Array.from(document.querySelectorAll('button')).find(button => button.textContent.trim() === 'Đóng');
                                    if (closeButton) closeButton.click();
                                    codeInputField.value = code;
                                    input.value = `Code: ${code} - Đã điền mã, đang chuyển trang...`;
                                    confirmButton.click();
                                } else {
                                    input.value = `Code: ${code} - Lỗi: Không tìm thấy ô nhập mã hoặc nút Xác nhận`;
                                    alert("Lỗi Chuyển Trang. Tự cop code: " + code + " vào ô 'Nhập mã ở đây' và bấm 'Xác nhận' thủ công.");
                                }
                            } else {
                                input.value = "Code: " + code;
                            }
                            startBtn.disabled = false;
                        }
                    }, 1000);
                } else {
                    input.readOnly = false;
                    console.error("Không có mã trả về từ startBypass");
                    input.value = "Lỗi! Vui lòng xem lại URL.";
                }
                sessionStorage.removeItem("ymnclk");
                localStorage.removeItem("codexn");
            } catch (error) {
                console.error("Lỗi khi gọi startBypass:", error);
            }
        };
        buttonRow.appendChild(startBtn);
        const transferBtn = document.createElement('button');
        transferBtn.textContent = 'Chuyển Trang';
        transferBtn.style.flex = '1';
        transferBtn.style.padding = '10px';
        transferBtn.style.borderRadius = '30px';
        transferBtn.style.border = 'none';
        transferBtn.style.cursor = 'pointer';
        transferBtn.style.backgroundColor = '#4B0082';
        transferBtn.style.color = '#FFD700';
        transferBtn.style.fontWeight = 'bold';
        transferBtn.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.5)';
        transferBtn.style.textShadow = '0 0 5px rgba(255, 255, 0, 0.8), 0 0 10px rgba(255, 255, 0, 0.6)';
        transferBtn.style.border = '1px solid #FFD700';
        transferBtn.style.boxSizing = 'border-box';
        transferBtn.style.transition = 'all 0.2s ease-in-out';
        transferBtn.addEventListener('touchstart', () => {
            transferBtn.style.transform = 'translateY(4px)';
            transferBtn.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.7)';
        });
        transferBtn.addEventListener('touchend', () => {
            transferBtn.style.transform = 'translateY(0)';
            transferBtn.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.5)';
        });
        transferBtn.onclick = () => {
            const codeInputField = document.querySelector('input[placeholder="Nhập mã vào đây"]');
            const confirmButton = Array.from(document.querySelectorAll('button')).find(button => button.textContent.trim() === 'Xác nhận');
            if (codeInputField && confirmButton) {
                const closeButton = Array.from(document.querySelectorAll('button')).find(button => button.textContent.trim() === 'Đóng');
                if (closeButton) closeButton.click();
                const code = input.value.match(/Code: (\S+)/)?.[1];
                if (code) {
                    codeInputField.value = code;
                    input.value = `Code: ${code} - Đã điền mã, đang chuyển trang...`;
                    confirmButton.click();
                } else {
                    input.value = 'Lỗi: Không tìm thấy mã để chuyển trang';
                    alert('Vui lòng chạy Bypass trước để lấy mã.');
                }
            } else {
                input.value = 'Lỗi: Không tìm thấy ô nhập mã hoặc nút Xác nhận';
                alert("Lỗi.............");
            }
        };
        buttonRow.appendChild(transferBtn);
        const reloadBtn = document.createElement('button');
        reloadBtn.textContent = 'Đổi Nhiệm Vụ';
        reloadBtn.style.flex = '1';
        reloadBtn.style.padding = '10px';
        reloadBtn.style.borderRadius = '30px';
        reloadBtn.style.border = 'none';
        reloadBtn.style.cursor = 'pointer';
        reloadBtn.style.backgroundColor = '#4B0082';
        reloadBtn.style.color = '#FFD700';
        reloadBtn.style.fontWeight = 'bold';
        reloadBtn.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.5)';
        reloadBtn.style.textShadow = '0 0 5px rgba(255, 255, 0, 0.8), 0 0 10px rgba(255, 255, 0, 0.6)';
        reloadBtn.style.transition = 'all 0.2s ease-in-out';
        reloadBtn.style.border = '1px solid #FFD700';
        reloadBtn.style.boxSizing = 'border-box';
        reloadBtn.addEventListener('touchstart', () => {
            reloadBtn.style.transform = 'translateY(4px)';
            reloadBtn.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.7)';
        });
        reloadBtn.addEventListener('touchend', () => {
            reloadBtn.style.transform = 'translateY(0)';
            reloadBtn.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.5)';
        });
        reloadBtn.onclick = async () => {
            input.readOnly = true;
            input.value = 'Đang Đổi Nhiệm Vụ...';
            doiNhiemvu();
        };
        buttonRow.appendChild(reloadBtn);
        container.appendChild(buttonRow);
        document.body.appendChild(container);
        if (autoStartCheckbox.checked) {
            startBtn.click();
        }
        const errorLink = document.createElement('a');
        errorLink.textContent = '? Báo Lỗi ?';
        errorLink.style.fontSize = '10px';
        errorLink.style.fontWeight = 'bold';
        errorLink.style.marginTop = '20px';
        errorLink.style.fontStyle = 'normal';
        errorLink.style.textAlign = 'center';
        errorLink.style.backgroundSize = '200% auto';
        errorLink.style.color = '#FFFF66';
        errorLink.style.textShow = '0 0 8px #FFD700, 0 0 20px #FFD700, 0 0 30px #FFD700';
        errorLink.style.backgroundClip = 'text';
        errorLink.style.webkitBackgroundClip = 'text';
        errorLink.style.textDecoration = 'underline';
        errorLink.href = 'https://facebook.com/lapho111';
        errorLink.target = '_blank';
        errorLink.style.fontFamily = 'Sans-serif';
        container.appendChild(errorLink);
    }
    const url = window.location.href;
    window.onload = () => {
        if (url.includes('https://yeumoney.com/')) {
            recognizeTrafficURL().then(taskURL => {
                createUI(taskURL);
            }).catch(error => {
                console.error("Lỗi khi nhận diện URL:", error);
                createUI("Lỗi! Tự nhập URL hoặc Reload");
            });
        } else if (url.includes('https://docs.google.com/spreadsheets/')) {
            fetchGoogleSheetHyperlinks()
                .then(data => {
                    if (data) {
                        window.location.href = data;
                    }
                })
                .catch(error => console.error("Lỗi khi gọi hàm:", error));
        } else if (url.includes('https://docs.google.com/forms/')) {
            completeGoogleForms();
        }
    };
})();
