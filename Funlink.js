// ==UserScript==
// @name         Funlink.io Bypass
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Nhận diện link funlink.io và tìm mã khi nhấn nút Bypass
// @author       Grok (dựa trên yêu cầu của bạn)
// @match        *://funlink.io/*
// @icon         https://funlink.io/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue

// ==/UserScript==


(function() {
    'use strict';

  
  
  const GET_VUATRAFFIC_URL = "https://traffic-user.net/GET_VUATRAFFIC.php";
const GET_MA_URL = "https://traffic-user.net/GET_MA.php";
const GOOGLE_URL = "https://www.google.com/";

  if (!window.location.href.startsWith('https://funlink.io/')) return;

    // Tạo giao diện
    const blackTab = document.createElement('div');
    let isMinimized = false;

    blackTab.style.position = 'fixed';
    blackTab.style.bottom = '20px';
    blackTab.style.left = '20px';
    blackTab.style.backgroundColor = '#000000';
    blackTab.style.width = '50px';
    blackTab.style.height = '50px';
    blackTab.style.zIndex = '9999';
    blackTab.style.borderRadius = '50%';
    blackTab.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
    blackTab.style.transition = 'all 0.5s ease';

    setTimeout(() => {
        blackTab.style.width = '93%';
        blackTab.style.height = '53%';
        blackTab.style.left = '50%';
        blackTab.style.transform = 'translateX(-50%)';
        blackTab.style.borderRadius = '5%';
    }, 100);

    const closeButton = document.createElement('img');
    closeButton.src = 'https://raw.githubusercontent.com/lapho111/Bypass/refs/heads/main/IMG_3520.webp';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.width = '20px';
    closeButton.style.height = '20px';
    closeButton.style.cursor = 'pointer';

    const des = document.createElement('p');
    des.textContent = 'Welcome To Lạp Hộ';
    des.style.margin = '0';
  des.style.marginTop = '10px';
    des.style.marginBottom = '10px';
    des.style.fontSize = '10px';
    des.style.fontStyle = 'italic';
    des.style.textAlign = 'center';
    des.style.display = 'block';
    des.style.color = '#ffffff';
    des.style.textDecoration = 'underline';
    const title = document.createElement('h3');
    title.textContent = 'Bypass Funlink:';
    title.style.margin = '0';
    title.style.fontWeight = 'bold';
    title.style.marginBottom = '10px';
    title.style.fontSize = '25px';
    title.style.color = '#ffff00';
    title.style.textAlign = 'center';
    title.style.textShadow = '0 0 5px rgba(255, 255, 255, 0.7), 0 0 10px rgba(255, 255, 255, 0.6), 0 0 15px rgba(255, 255, 255, 0.5)';
    blackTab.appendChild(des);
    blackTab.appendChild(title);

    const searchContainer = document.createElement('div');
    searchContainer.style.display = 'flex';
    searchContainer.style.justifyContent = 'center';
    searchContainer.style.marginBottom = '15px';
    searchContainer.style.width = '100%';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Nhập link để bypass...';
    searchInput.style.width = '80%';
    searchInput.style.padding = '8px';
    searchInput.style.borderRadius = '15px';
    searchInput.style.border = '1px solid #FFD700';
    searchInput.style.backgroundColor = '#1a1a1a';
    searchInput.style.color = '#ffffff';
    searchInput.style.fontSize = '14px';
    searchInput.style.outline = 'none';
    searchInput.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.3)';
    searchInput.style.transition = 'all 0.3s ease';

    searchInput.addEventListener('focus', () => {
        searchInput.style.boxShadow = '0 0 8px rgba(255, 215, 0, 0.5)';
    });
    searchInput.addEventListener('blur', () => {
        searchInput.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.3)';
    });

    searchContainer.appendChild(searchInput);
    blackTab.appendChild(searchContainer);

    // Cân đối các nút Auto Bypass và Auto chuyển trang
    const autoContainer = document.createElement('div');
    autoContainer.style.display = 'flex';
    autoContainer.style.justifyContent = 'center'; // Căn giữa các nút
    autoContainer.style.alignItems = 'center';
    autoContainer.style.width = '100%';
    autoContainer.style.marginBottom = '15px';
    autoContainer.style.gap = '20px'; // Khoảng cách giữa hai nút

    const autoBypassContainer = document.createElement('label');
    autoBypassContainer.style.display = 'flex';
    autoBypassContainer.style.alignItems = 'center';
    autoBypassContainer.style.cursor = 'pointer';

    const autoBypassCheckbox = document.createElement('input');
    autoBypassCheckbox.type = 'checkbox';
    autoBypassCheckbox.checked = true;
    autoBypassCheckbox.style.marginRight = '5px';

    const autoBypassLabel = document.createElement('span');
    autoBypassLabel.textContent = 'Auto Bypass (90%)';
    autoBypassLabel.style.color = '#00BFFF';
    autoBypassLabel.style.fontSize = '14px';

    autoBypassContainer.appendChild(autoBypassCheckbox);
    autoBypassContainer.appendChild(autoBypassLabel);

    const autoNavigateContainer = document.createElement('label');
    autoNavigateContainer.style.display = 'flex';
    autoNavigateContainer.style.alignItems = 'center';
    autoNavigateContainer.style.cursor = 'pointer';

    const autoNavigateCheckbox = document.createElement('input');
    autoNavigateCheckbox.type = 'checkbox';
    autoNavigateCheckbox.checked = true;
    autoNavigateCheckbox.style.marginRight = '5px';

    const autoNavigateLabel = document.createElement('span');
    autoNavigateLabel.textContent = 'Auto chuyển trang';
    autoNavigateLabel.style.color = '#00BFFF';
    autoNavigateLabel.style.fontSize = '14px';

    autoNavigateContainer.appendChild(autoNavigateCheckbox);
    autoNavigateContainer.appendChild(autoNavigateLabel);

    autoContainer.appendChild(autoBypassContainer);
    autoContainer.appendChild(autoNavigateContainer);
    blackTab.appendChild(autoContainer);

    const startBtn = document.createElement('button');
    startBtn.textContent = 'Bypass';
    startBtn.style.flex = '1';
  startBtn.style.width ='90%';
    startBtn.style.padding = '10px';
  startBtn.style.margin = '0'; // Xóa margin để tránh ảnh hưởng khi xếp dọc
    startBtn.style.borderRadius = '15px';
    startBtn.style.border = 'none';
    startBtn.style.cursor = 'pointer';
    startBtn.style.backgroundColor = '#4B0082';
    startBtn.style.color = '#FFD700';
    startBtn.style.fontWeight = 'bold';
    startBtn.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.5)';
    startBtn.style.textShadow = '0 0 5px rgba(255, 255, 0, 0.8), 0 0 10px rgba(255, 255, 0, 0.6)';
    startBtn.style.border = '1px solid #FFD700';
    startBtn.style.transition = 'all 0.2s ease-in-out';

    startBtn.addEventListener('touchstart', () => {
        startBtn.style.transform = 'translateY(4px)';
        startBtn.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.7)';
    });
    startBtn.addEventListener('touchend', () => {
        startBtn.style.transform = 'translateY(0)';
        startBtn.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.5)';
    }); startBtn.style.margin ='0 auto';

    const reloadBtn = document.createElement('button');
    reloadBtn.textContent = 'Chuyển Trang';
    reloadBtn.style.flex = '80%';
    reloadBtn.style.width= '90%';
    reloadBtn.style.padding = '10px';
    reloadBtn.style.borderRadius = '15px';
    reloadBtn.style.border = 'none';
    reloadBtn.style.cursor = 'pointer';
    reloadBtn.style.backgroundColor = '#4B0082';
    reloadBtn.style.color = '#FFD700';
    reloadBtn.style.fontWeight = 'bold';
    reloadBtn.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.5)';
    reloadBtn.style.textShadow = '0 0 5px rgba(255, 255, 0, 0.8), 0 0 10px rgba(255, 255, 0, 0.6)';
    reloadBtn.style.transition = 'all 0.2s ease-in-out';
    reloadBtn.style.border = '1px solid #FFD700';

    reloadBtn.addEventListener('touchstart', () => {
        reloadBtn.style.transform = 'translateY(4px)';
        reloadBtn.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.7)';
    });
    reloadBtn.addEventListener('touchend', () => {
        reloadBtn.style.transform = 'translateY(0)';
        reloadBtn.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.5)';
    }); reloadBtn.style.margin ='0 auto';
const changeKeywordBtn = document.createElement('button');
changeKeywordBtn.textContent = 'Đổi Từ Khoá Mới';
changeKeywordBtn.style.width = '90%';
changeKeywordBtn.style.padding = '10px';
changeKeywordBtn.style.borderRadius = '15px';
changeKeywordBtn.style.border = 'none';
changeKeywordBtn.style.cursor = 'pointer';
changeKeywordBtn.style.backgroundColor = '#4B0082';
changeKeywordBtn.style.color = '#FFD700';
changeKeywordBtn.style.fontWeight = 'bold';
changeKeywordBtn.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.5)';
changeKeywordBtn.style.textShadow = '0 0 5px rgba(255, 255, 0, 0.8), 0 0 10px rgba(255, 255, 0, 0.6)';
changeKeywordBtn.style.border = '1px solid #FFD700';
changeKeywordBtn.style.transition = 'all 0.2s ease-in-out';
changeKeywordBtn.addEventListener('touchstart', () => {
    changeKeywordBtn.style.transform = 'translateY(4px)';
    changeKeywordBtn.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.7)';
});
changeKeywordBtn.addEventListener('touchend', () => {
    changeKeywordBtn.style.transform = 'translateY(0)';
    changeKeywordBtn.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.5)';
});    changeKeywordBtn.style.margin = '0 auto';
   changeKeywordBtn.addEventListener('click', () => {
    const funlinkChangeKeywordBtn = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.includes('Đổi từ khóa mới'));
    if (funlinkChangeKeywordBtn) {
        funlinkChangeKeywordBtn.click();
    setTimeout(() => {
    recognizeTrafficURL(); // Gọi lại hàm tìm kiếm link sau khi đổi từ khóa
}, 1000);   
    } else {
        console.log('Không tìm thấy nút "Đổi từ khóa mới" trên trang funlink.io');
    }
});// Đợi 1 giây để đảm bảo trang đã cập nhật
  const container = document.createElement('div');
    container.style.display = 'flex';
  container.style.gap = '10px'; // Tăng khoảng cách lên 30px (có thể điều chỉnh tùy ý)
container.style.setProperty('flex-direction', 'column', 'important'); // Đảm bảo không bị ghi đè  container.style.width = '100%';
    container.appendChild(startBtn);
    container.appendChild(reloadBtn);
  container.appendChild(changeKeywordBtn);
    blackTab.appendChild(container);

    // Căn giữa nút Báo Lỗi
    const errorLinkContainer = document.createElement('div');
    errorLinkContainer.style.display = 'flex';
    errorLinkContainer.style.justifyContent = 'center';
    errorLinkContainer.style.width = '100%';
    errorLinkContainer.style.marginTop = '15px';

    const errorLink = document.createElement('a');
    errorLink.textContent = '? Báo Lỗi ?';
    errorLink.style.fontSize = '10px';
    errorLink.style.fontWeight = 'bold';
    errorLink.style.fontStyle = 'normal';
    errorLink.style.color = '#FFFF66';
    errorLink.style.textDecoration = 'underline';
    errorLink.href = 'https://facebook.com/lapho111';
    errorLink.target = '_blank';
    errorLink.style.fontFamily = 'Sans-serif';

    errorLinkContainer.appendChild(errorLink);
    blackTab.appendChild(errorLinkContainer);

    blackTab.appendChild(closeButton);
    document.body.appendChild(blackTab);
  blackTab.addEventListener('click', (event) => {
    if (isMinimized) {
        event.preventDefault(); // Ngăn chặn hành vi mặc định (như mở link Facebook)
        event.stopPropagation(); // Ngăn sự kiện lan tỏa
        toggleTab(); // Phóng to lại tab
    }
});

    // Hàm nhận diện link (tương tự Yeumoney)
    const recognizeTrafficURL = async () => {
        searchInput.value = "Đang nhận diện URL...";
        const images = document.querySelectorAll("img");
        const ocrApi = "https://api.ocr.space/parse/imageurl?apikey=K81664733488957&isOverlayRequired=false&OCREngine=2";

        console.log("Tổng số ảnh tìm thấy:", images.length);

        for (let img of images) {
            const src = img.src;
            console.log("URL ảnh:", src);

            if (!src || src.startsWith("data:image")) {
                console.log("Bỏ qua ảnh không hợp lệ:", src);
                continue;
            }

            try {
                const res = await fetch(`${ocrApi}&url=${encodeURIComponent(src)}`);
                const data = await res.json();
                if (!data.ParsedResults || !data.ParsedResults[0]) {
                    console.log("Không có kết quả OCR cho ảnh:", src);
                    continue;
                }

                const text = data.ParsedResults[0].ParsedText.toLowerCase();
                console.log("OCR Text:", text);

                // Ánh xạ từ khóa giống Yeumoney
                let taskURL = '';
                if (text.includes('188bet')) {
                    taskURL = `https://88bet.hiphop`;
                } else if (text.includes('w88')) {
                    taskURL = `https://w88vt.com/`;
                } else if (text.includes('fb88')) {
                    taskURL = `https://fb88.com/`;
                } else if (text.includes('m88')) {
                    taskURL = `https://bet88.com/`;
                } else if (text.includes('vn88')) {
                    taskURL = `https://vn88.com/`;
                } else if (text.includes('v9bet')) {
                    taskURL = `https://v9bet.com/`;
                } else {
                    taskURL = `Chưa nhận diện được URL!`;
                }

                if (taskURL !== `Chưa nhận diện được URL!`) {
                    searchInput.value = taskURL;
                    return taskURL;
                }
            } catch (err) {
                console.error("OCR failed for image:", src, err);
                searchInput.value = "Lỗi nhận diện ảnh!";
            }
        }
        searchInput.value = "Không nhận diện được link!";
        return null;
    };

    // Hàm tìm mã (tương tự Yeumoney)
   
  
  
  
  
  function generateTimestampData(taskURL) {
    const timestamp = Date.now();
    return `${timestamp},${GOOGLE_URL},${taskURL},IOS900,hidden,null`;
}

function fetchCodexn(ymnclk) {
    return new Promise((resolve, reject) => {
        const timestampData = generateTimestampData(recognizedUrl);
        const xhr = new XMLHttpRequest();
        const fetchUrl = `${GET_VUATRAFFIC_URL}?data=${timestampData}&clk=${ymnclk}`;
        xhr.open("POST", fetchUrl, true);
        xhr.onload = function () {
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
        xhr.onload = function () {
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

const findCode = async (recognizedUrl) => {
    try {
        searchInput.value = "Đang lấy mã...";
        startBtn.disabled = true;

        const codexn1 = await fetchCodexn(null);
        const url1 = recognizedUrl.replace(/\/$/, "");
        const ymnclk = await fetchCode(codexn1, url1, GOOGLE_URL, null);
        const codexn2 = await fetchCodexn(ymnclk);
        const url2 = recognizedUrl + "admin";
        const result = await fetchCode(codexn2, url2, recognizedUrl, ymnclk);

        if (result) {
            searchInput.value = `Mã: ${result}`;
            return result;
        } else {
            throw new Error("Không lấy được mã từ API");
        }
    } catch (error) {
        console.error("Lỗi khi lấy mã:", error);
        searchInput.value = "Lỗi! Không lấy được mã.";
        return null;
    } finally {
        startBtn.disabled = false;
    }
};
  
  
  

    // Xử lý nút Bypass
    startBtn.addEventListener('click', async () => {
        const recognizedUrl = await recognizeTrafficURL();
        if (recognizedUrl && recognizedUrl !== "Chưa nhận diện được URL!") {
            const code = await findCode();
            if (!code) {
                searchInput.value = "Không tìm thấy mã!";
            }
        } else {
            searchInput.value = "Không nhận diện được link!";
        }
    });

    // Tự động nhận diện khi tải trang
    recognizeTrafficURL();

    // Ẩn/hiện tab
    const toggleTab = () => {
        if (!isMinimized) {
            blackTab.style.transform = 'none';
            blackTab.style.borderRadius = '50%';
            blackTab.style.backgroundImage = 'url(https://raw.githubusercontent.com/lapho111/Bypass/refs/heads/main/Logo.jpeg)';
            blackTab.style.backgroundSize = 'cover';
            blackTab.style.backgroundPosition = 'center';
            blackTab.style.bottom = '20px';
            blackTab.style.left = '20px';
            blackTab.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.5)';
            blackTab.style.padding = '0';
            blackTab.style.width = '50px';
            blackTab.style.height = '50px';
            blackTab.querySelectorAll('*').forEach(child => {
                child.style.opacity = '0';
            });
            isMinimized = true;
        } else {
            blackTab.style.transform = 'translateX(-50%)';
            blackTab.style.borderRadius = '5%';
            blackTab.style.backgroundColor = '#000000';
            blackTab.style.bottom = '20px';
            blackTab.style.left = '50%';
            blackTab.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
            blackTab.style.padding = '0';
            blackTab.style.width = '93%';
            blackTab.style.height = '53%';
            blackTab.style.backgroundImage = 'none';
            blackTab.querySelectorAll('*').forEach(child => {
                child.style.opacity = '1';
            });
            isMinimized = false;
        }
    };

    closeButton.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleTab();
    });
})();
