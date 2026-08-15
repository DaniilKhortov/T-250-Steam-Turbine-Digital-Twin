// Константи
const PO = 240;
const TO = 545;
const TGPL = 545;


// 1. Розрахунок фактичної витрати пари Вт [тис. м³/год]
function calculateVt(Vt_percent) {
    let temp = Vt_percent * 82;
    return temp.toFixed(0);
}

// 2. Розрахунок теплової потужності Qt [Гкал/год]
function calculateQt(Vt_percent, UP_percent) {
    let k = -344.86 * UP_percent + 305.87;
    console.log('k:',k)
    let b = -12.522 * UP_percent + 11.104;
    console.log('b:',b)
    return k * Vt_percent + b;
}

// 3. Розрахунок кінцевої температури t1 [°C] після нагріву
function calculateT1(t2, Qt, G_sv) {
    
    return t2 + (Qt / G_sv * 1000);
}

// 4. Розрахунок витрати через байпасний контур Gбайпас [м³/год]
function calculateGBypass(G_sv, Bypass_percent) {
    return G_sv * Bypass_percent;
}

// 5. Розрахунок витрати через основний контур Gпсг2 [м³/год]
function calculateGPsg2(G_sv, Bypass_percent) {
    let G_psg2 = G_sv * (1 - Bypass_percent);
    console.log("G_psg2",G_psg2);
    // Перевірка меж та виклик помилки у разі їх перевищення
    if (G_psg2 <= 1500) {
        throw new Error("Ви досягли нижньої межі. Закрийте байпас ПСГ-1 або збільшіть витрату охолоджувальної пари.");
    } else if (G_psg2 > 4500) {
        throw new Error("Ви досягли верхньої межі. Відкрийте байпас ПСГ-1 або зменшіть витрату охолоджувальної пари.");
    }
    
    return G_psg2;
}

//6. Рохрахунок температури ПСГ-2
function calculateTPsg2(t2, Qt, G_psg2) { 
    return t2 + (Qt / G_psg2) * 1000;
}

//7. Розрахунок тиску у відбоі
function calculatePt(t1) { 
    console.log('t1:',t1)
    let pt = 2 * Math.pow(10, -7) * Math.pow(t1 + 4, 3.3289) + 0.2;
    console.log('pt', pt)
    if (pt <= 0.6) {
        throw new Error("Тиск у відборі низький. Відкрийте діафрагму або закрийте подачу пари ПСГ-2.");
    } else if (pt >= 1.8) {
        throw new Error("Тиск у відборі високий. Закрийте діафрагму або збільшіть навантаження енергоблоку.");
    }
    return pt
}

//8. Розрахунок теплового виділу
function calculateQo(Vt_percent, pt, Qt) {  
    return Vt_percent * (25 * pt + Qt + 0.72 * (Qt - 35) * Math.pow(pt, -0.07));
}

// 9. Обрахунок загальної потужності
function calculateNe(qo, pt, Qt) { 
    return (1 / 1.7) * (qo - 25 * pt - 1.05 * Qt + 0.65 * (Qt - 35) * Math.pow(pt, -0.07) + 8);
}

// 2.1. Розрахунок теплової потужності Qt коли заслонка закрита
function calculateQt_2() { 
    return 0;
}

// 9.1. Обрахунок загальної потужності коли заслонка закрита
function calculateNe_2(Vt_percent) { 
    return 304.21 * Vt_percent - 8.545;
}

//10. Обрахунок "чистої" потужності
function calculateNtp(qo) {  
    return 0.027 * qo - 4.7;
}


function calculate() {
            const cut_out = Number(document.getElementById("cut_out").value);
            const Vt_percent = Number(document.getElementById("Vt_percent").value)/100;
            const UP_percent = Number(document.getElementById("UP_percent").value)/100;
            const t2 = Number(document.getElementById("t2").value);
            const G_sv = Number(document.getElementById("G_sv").value);
            const Bypass_percent = Number(document.getElementById("Bypass_percent").value)/100;

            let results = {};
            try {
                const Vt = calculateVt(Vt_percent);
                const G_bypass = calculateGBypass(G_sv, Bypass_percent);
                const G_psg2 = calculateGPsg2(G_sv, Bypass_percent);

                if (cut_out === 1) {
                    const Qt = calculateQt(Vt_percent, UP_percent);
                    const t1 = calculateT1(t2, Qt, G_sv);
                    const t_psg2 = calculateTPsg2(t2, Qt, G_psg2);
                    const pt = calculatePt(t1);
                    const qo = calculateQo(Vt_percent, pt, Qt);
                    const Ne = calculateNe(qo, pt, Qt);
                    const Ntp = calculateNtp(qo);
                    results = { Vt, G_bypass, G_psg2, Qt, t1, t_psg2, pt, qo, Ne, Ntp };
                } else {
                    const Qt = calculateQt_2();
                    const t1 = calculateT1(t2, Qt, G_sv);
                    const t_psg2 = calculateTPsg2(t2, Qt, G_psg2);
                    const pt = calculatePt(t1);
                    const qo = calculateQo(Vt_percent, pt, Qt);
                    const Ne = calculateNe_2(Vt_percent);
                    const Ntp = calculateNtp(qo);
                    results = { Vt, G_bypass, G_psg2, Qt, t1, t_psg2, pt, qo, Ne, Ntp };
                }

                displayResults(results);
            } catch (error) {
                alert("Помилка: " + error.message);
            }
        }

        function displayResults(results) {
            const resultsDiv = document.getElementById("results");
            resultsDiv.innerHTML = `

                <div class="results-grid">
                    <div class="result-item"><strong>Фактична витрата пари Вт:</strong> ${results.Vt} тис. м³/год</div>
                    <div class="result-item"><strong>Теплова потужність Qt:</strong> ${results.Qt.toFixed(2)} Гкал/год</div>
                    <div class="result-item"><strong>Кінцева температура t1:</strong> ${results.t1.toFixed(2)} °C</div>
                    <div class="result-item"><strong>Витрата через байпасний контур Gбайпас:</strong> ${results.G_bypass.toFixed(2)} м³/год</div>
                    <div class="result-item"><strong>Витрата через основний контур Gпсг2:</strong> ${results.G_psg2.toFixed(2)} м³/год</div>
                    <div class="result-item"><strong>Температура Tпсг2:</strong> ${results.t_psg2.toFixed(2)} °C</div>
                    <div class="result-item"><strong>Потужність Pt:</strong> ${results.pt.toFixed(2)} Вт</div>
                    <div class="result-item"><strong>Тепловий вивід Q0:</strong> ${results.qo.toFixed(2)} Дж</div>
                    <div class="result-item"><strong>Загальна потужність Ne:</strong> ${results.Ne.toFixed(2)} Вт</div>
                    <div class="result-item"><strong>"Чиста" потужність Ntp:</strong> ${results.Ntp.toFixed(2)} Вт</div>
                </div>
            `;
        }        
/*
function mainCalculation(cut_out, Vt_percent, UP_percent, t2, G_sv, Bypass_percent) {
    try {
        // Обчислення вихідних даних
        let Vt, G_bypass, G_psg2, Qt, t1, t_psg2, pt, qo, Ne, Ntp;
        Vt = calculateVt(Vt_percent);//1
        G_bypass = calculateGBypass(G_sv, Bypass_percent);//4
        G_psg2 = calculateGPsg2(G_sv, Bypass_percent);//5

        if (cut_out === 1) {
            Qt = calculateQt(Vt_percent, UP_percent);//2
            t1 = calculateT1(t2, Qt, G_sv);//3
            t_psg2 = calculateTPsg2(t2, Qt, G_psg2);//6

            pt = calculatePt(t1);//7
            qo = calculateQo(Vt_percent, pt, Qt);//8
            Ne = calculateNe(qo, pt, Qt);//9
            Ntp = calculateNtp(qo);//10  
        } else  {//if (cut_out == 0)
            
            Qt = calculateQt_2();//2.1
            t1 = calculateT1(t2, Qt, G_sv);//3
            t_psg2 = calculateTPsg2(t2, Qt, G_psg2);//6

            pt = calculatePt(t1);//7
            qo = calculateQo(Vt_percent, pt, Qt);//8
            Ne = calculateNe_2(Vt_percent);//9.1
            Ntp = calculateNtp(qo);//10 
            
        }
        

        // Виведення результатів
        console.log(`Фактична витрата пари Вт: ${Vt} тис. м³/год`);
        console.log(`Теплова потужність Qt: ${Qt.toFixed(2)} Гкал/год`);
        console.log(`Кінцева температура t1: ${t1.toFixed(2)} °C`);
        console.log(`Витрата через байпасний контур Gбайпас: ${G_bypass.toFixed(2)} м³/год`);
        console.log(`Витрата через основний контур Gпсг2: ${G_psg2.toFixed(2)} м³/год`);

        console.log(`Температура Tпсг2: ${t_psg2.toFixed(2)} °C`);
        console.log(`Потужність Pt: ${pt.toFixed(2)} Вт`);
        console.log(`Тепловий вивід Q0: ${qo.toFixed(2)} Дж`);
        console.log(`Загальна потужність Ne: ${Ne.toFixed(2)} Вт`);
        console.log(`"Чиста" потужність: ${Ntp.toFixed(2)} Вт`);
    } catch (error) {
        // Виведення повідомлення про помилку та зупинка програми
        console.error("Помилка:", error.message);
    }
}// cut_out, Vt_percent, UP_percent, t2, G_sv, Bypass_percent
// Приклад використання основної функції
mainCalculation(
    0,
    0.4,     
    1,     
    40,     
    4500,    
    0.01      
);
*/