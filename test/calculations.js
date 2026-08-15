
import { expect } from 'chai';
import { assert } from 'chai';

import sinon from 'sinon';
// Імпортуємо новий клас
import TurbineCalculator from '../src/module-calc.js';

describe('Calculation Module Tests', function () {
    // Тест для calculateVt
    describe('calculateVt', function () {
        it('should correctly calculate Vt', function () {
            // Очікується, що результат буде 73.8 для Vt_percent = 0.9
            const calculator = new TurbineCalculator();
            const result = calculator.calculateVt(0.9);
            assert.strictEqual(result, 73.8);
        });
    });

    // Тест для calculateQt
    describe('calculateQt', function () { //Vt_percent, UP_percent
        it('should correctly calculate Qt', function () {
            // Перевіряємо результат для Vt_percent = 0.8 та UP_percent = 0.6
            const calculator = new TurbineCalculator();
            const result = calculator.calculateQt(0.9, 0.4);
            assert.isNumber(result); // Перевірка типу
            assert.approximately(result, 157.2286, 0.01); // Перевірка точності
        });
    });

    // Тест для calculateT1
    describe('calculateT1', function () { //t2, Qt, G_sv
        it('should correctly calculate T1', function () {
            const calculator = new TurbineCalculator();
            // Перевіряємо результат для t2 = 50, Qt = 157.2286, G_sv = 4200
            const result = calculator.calculateT1(50, 157.2286, 4200);
            assert.approximately(result, 87.44, 0.05);
        });
    });

    // Тест для calculateGBypass
    describe('calculateGBypass', function () {
        it('should correctly calculate GBypass', function () {
            const calculator = new TurbineCalculator();
            // Вхідні дані: G_sv = 4200, Bypass_percent = 0.1
            const result = calculator.calculateGBypass(4200, 0.1);
            assert.strictEqual(result, 420);
        });
    });

    // Тест для calculateGPsg2
    describe('calculateGPsg2', function () {
        it('should correctly calculate GPsg2 and handle errors', function () {
            const calculator = new TurbineCalculator();
            // Перевіряємо результат для G_sv = 4200, Bypass_percent = 0.1
            const result = calculator.calculateGPsg2(4200, 0.1);
            assert.strictEqual(result, 3780);

            // Перевірка на помилку для занадто низького значення
            assert.throws(() => calculator.calculateGPsg2(1500, 0.1),
                "Ви досягли нижньої межі. Закрийте байпас ПСГ-1 або збільшіть витрату охолоджувальної пари.");

            // Перевірка на помилку для занадто високого значення
            assert.throws(() => calculator.calculateGPsg2(6000, 0.1),
                "Ви досягли верхньої межі. Відкрийте байпас ПСГ-1 або зменшіть витрату охолоджувальної пари.");
        });
    });

    // Тест для calculateTPsg2
    describe('calculateTPsg2', function () { //t2, Qt, G_psg2
        it('should correctly calculate TPsg2', function () {
            const calculator = new TurbineCalculator();
            // Перевіряємо результат для t2 = 50, Qt = 157.2286, G_psg2 = 3780
            assert.approximately(calculator.calculateTPsg2(50, 157.2286, 3780), 91.59487, 0.01);
        });
    });

    // Тест для calculatePt
    describe('calculatePt', function () {
        it('should correctly calculate Pt and handle errors', function () {
            // Перевіряємо результат для t1 = 87.43538
            const calculator = new TurbineCalculator();
            assert.approximately(calculator.calculatePt(87.43538), 0.875, 0.01);

            // Перевірка на помилку для низького тиску
            assert.throws(() => calculator.calculatePt(1),
                "Тиск у відборі низький. Відкрийте діафрагму або закрийте подачу пари ПСГ-2.");

            // Перевірка на помилку для високого тиску
            assert.throws(() => calculator.calculatePt(200),
                "Тиск у відборі високий. Закрийте діафрагму або збільште навантаження енергоблоку.");
        });
    });

    // Тест для calculateQo
    describe('calculateQo', function () { //Vt_percent, pt, Qt
        it('should correctly calculate Qo', function () {
            const calculator = new TurbineCalculator();
            // Вхідні дані: Vt_percent = 0.9, pt = 0.875124, Qt = 157.2286
            assert.approximately(calculator.calculateQo(0.9, 0.875124, 157.2286), 241.1432, 0.01);
        });
    });

    // Тест для calculateNe
    describe('calculateNe', function () { //qo, pt, Qt
        it('should correctly calculate Ne', function () {
            const calculator = new TurbineCalculator();
            // Вхідні дані: qo = 241.1432, pt = 0.875124, Qt = 157.2286
            assert.approximately(calculator.calculateNe(241.1432, 0.875124, 157.2286), 83.75, 0.01);
        });
    });

    // Тест для calculateQt_2
    describe('calculateQt_2', function () {
        it('should return 0', function () {
            const calculator = new TurbineCalculator();
            // Заслонка закрита, очікується 0
            assert.strictEqual(calculator.calculateQt_2(), 0);
        });
    });

    // Тест для calculateNe_2
    describe('calculateNe_2', function () {
        it('should correctly calculate Ne when заслонка closed', function () {
            const calculator = new TurbineCalculator();
            // Вхідні дані: Vt_percent = 0.9
            assert.approximately(calculator.calculateNe_2(0.9), 265.244, 0.01);
        });
    });

    // Тест для calculateNtp
    describe('calculateNtp', function () {
        it('should correctly calculate Ntp', function () {
            const calculator = new TurbineCalculator();
            // Вхідні дані: qo = 200
            assert.approximately(calculator.calculateNtp(241.1432), 1.81, 0.01);
        });
    });
});

describe('Calculation Module Tests with Twin', function () {
    let spy;

    //afterEach(() => {
        // Відновлюємо початковий стан після кожного тесту
    //    if (spy) spy.restore();
    //});

    // 1. Тест для calculateVt
    describe('calculateVt', function () {
        it('should correctly calculate Vt', function () {
            const calculator = new TurbineCalculator();
            spy = sinon.spy(calculator.calculateVt);
            const result = spy(0.8); // Vt_percent = 0.8
            assert.approximately(result, 65.6, 0.0001);
            assert.isTrue(spy.calledOnce);
            assert.isTrue(spy.calledWith(0.8));
        });
    });

    // 2. Тест для calculateQt
    describe('calculateQt', function () {
        it('should correctly calculate Qt', function () {
            const calculator = new TurbineCalculator();
            spy = sinon.spy(calculator.calculateQt);
            const result = spy(0.8, 0.2); // Вхідні значення: Vt_percent=0.8, UP_percent=0.2
            assert.isNumber(result);
            assert.approximately(result, 198.118, 0.01);
            assert.isTrue(spy.calledOnce);
            assert.isTrue(spy.calledWith(0.8, 0.2));
        });
    });

    // 3. Тест для calculateT1
    describe('calculateT1', function () {
        it('should correctly calculate t1', function () {
            const calculator = new TurbineCalculator();
            spy = sinon.spy(calculator.calculateT1);
            const result = spy(40, 198.118, 4500); // t2=40, Qt=198.118, G_sv=4500
            assert.approximately(result, 84.02622, 0.001);
            assert.isTrue(spy.calledOnce);
            assert.isTrue(spy.calledWith(40, 198.118, 4500));
        });
    });

    // 4. Тест для calculateGBypass
    describe('calculateGBypass', function () {
        it('should correctly calculate GBypass', function () {
            const calculator = new TurbineCalculator();
            spy = sinon.spy(calculator.calculateGBypass);
            const result = spy(4500, 0); // G_sv=4500, Bypass_percent=0
            assert.strictEqual(result, 0);
            assert.isTrue(spy.calledOnce);
            assert.isTrue(spy.calledWith(4500, 0));
        });
    });

    // 5. Тест для calculateGPsg2
    describe('calculateGPsg2', function () {
        it('should correctly calculate GPsg2 and handle errors', function () {
            const calculator = new TurbineCalculator();
            spy = sinon.spy(calculator.calculateGPsg2);

            // Правильне значення
            const result = spy(4500, 0); // G_sv=4200, Bypass_percent=0.1
            assert.strictEqual(result, 4500);
            assert.isTrue(spy.calledOnce);

            // Перевірка на помилку для занадто низького значення
            assert.throws(() => spy(1200, 0.05),
                "Ви досягли нижньої межі. Закрийте байпас ПСГ-1 або збільшіть витрату охолоджувальної пари.");

            // Перевірка на помилку для занадто високого значення
            assert.throws(() => spy(6000, 0.05),
                "Ви досягли верхньої межі. Відкрийте байпас ПСГ-1 або зменшіть витрату охолоджувальної пари.");
        });
    });
    // 6. Тест для calculateTPsg2
    describe('calculateTPsg2', function () {
        it('should correctly calculate TPsg2', function () {
            const calculator = new TurbineCalculator();
            spy = sinon.spy(calculator.calculateTPsg2);
            const result = spy(40, 198.118, 4500); // t2 = 40 , Qt = 198.118 , G_psg2 =4500
            assert.approximately(result, 84.026, 0.02);
            assert(spy.calledOnce);
            assert(spy.calledWith(40, 198.118, 4500));
        });
    });

    // 7. Тест для calculatePt
    describe('calculatePt', function () {
        it('should correctly calculate Pt and handle errors', function () {
            const calculator = new TurbineCalculator();
            spy = sinon.spy(calculator.calculatePt);

            // Правильне значення
            const result = spy(84.02622); // t1=87.43538
            assert.approximately(result, 0.795, 0.01);
            assert(spy.calledOnce);
            assert(spy.calledWith(84.02622));

            // Низький тиск
            assert.throws(() => spy(1), "Тиск у відборі низький. Відкрийте діафрагму або закрийте подачу пари ПСГ-2.");

            // Високий тиск
            assert.throws(() => spy(200), "Тиск у відборі високий. Закрийте діафрагму або збільште навантаження енергоблоку.");
        });
    });

    // 8. Тест для calculateQo
    describe('calculateQo', function () {
        it('should correctly calculate Qo', function () {
            const calculator = new TurbineCalculator();
            spy = sinon.spy(calculator.calculateQo);
            const result = spy(0.8, 0.795, 198.118); // Vt_percent=0.8, pt=0.795, Qt=198.118
            assert.approximately(result, 269.87, 0.01);
            assert(spy.calledOnce);
            assert(spy.calledWith(0.8, 0.795, 198.118));
        });
    });

    // 9. Тест для calculateNe
    describe('calculateNe', function () {
        it('should correctly calculate Ne', function () {
            const calculator = new TurbineCalculator();
            spy = sinon.spy(calculator.calculateNe);
            const result = spy(269.87, 0.795, 198.118); // qo=269.87, pt=0.795, Qt=198.118
            assert.approximately(result, 92.775, 0.01);
            assert(spy.calledOnce);
            assert(spy.calledWith(269.87, 0.795, 198.118));
        });
    });

    // 10. Тест для calculateQt_2
    describe('calculateQt_2', function () {
        it('should correctly calculate Qt_2', function () {
            const calculator = new TurbineCalculator();
            spy = sinon.spy(calculator.calculateQt_2);
            const result = spy(); 
            assert.strictEqual(result, 0);
            assert(spy.calledOnce);
            assert(spy.calledWith());
        });
    });

    // 11. Тест для calculateNe_2
    describe('calculateNe_2', function () {
        it('should correctly calculate Ne_2', function () {
            const calculator = new TurbineCalculator();
            spy = sinon.spy(calculator.calculateNe_2);
            const result = spy(0.8); // Vt_percent = 0.8
            assert.approximately(result, 234.823, 0.01);
            assert(spy.calledOnce);
            assert(spy.calledWith(0.8));
        });
    });

    // 12. Тест для calculateNtp
    describe('calculateNtp', function () {
        it('should correctly calculate Ntp', function () {
            const calculator = new TurbineCalculator();
            spy = sinon.spy(calculator.calculateNtp);
            const result = spy(269.87); // qo = 269.87
            assert.approximately(result, 2.59, 0.02);
            assert(spy.calledOnce);
            assert(spy.calledWith(269.87));
        });
    });
});
/*
describe('Calculation Module Tests', function () {
    // Тест для calculateVt
    describe('calculateVt', function () {
        it('should correctly calculate Vt', function () {
            // Очікується, що результат буде 73.8 для Vt_percent = 0.9
            const result = calculateVt(0.9);
            expect(result).to.equal(73.8);
        });
    });

    // Тест для calculateQt
    describe('calculateQt', function () { //Vt_percent, UP_percent
        it('should correctly calculate Qt', function () {
            // Перевіряємо результат для Vt_percent = 0.8 та UP_percent = 0.6
            const result = calculateQt(0.9, 0.4);
            expect(result).to.be.a('number'); // Перевірка типу
            expect(result).to.be.closeTo(157.2286, 0.01); // Перевірка точності
        });
    });

    // Тест для calculateT1
    describe('calculateT1', function () { //t2, Qt, G_sv
        it('should correctly calculate T1', function () {
            // Перевіряємо результат для t2 = 50, Qt = 157.2286, G_sv = 4200
            const result = calculateT1(50, 157.2286, 4200);
            expect(result).to.be.closeTo(87.44, 0.05); 
        });
    });

    // Тест для calculateGBypass
    describe('calculateGBypass', function () {
        it('should correctly calculate GBypass', function () {
            // Вхідні дані: G_sv = 4200, Bypass_percent = 0.1
            const result = calculateGBypass(4200, 0.1);
            expect(result).to.equal(420);
        });
    });

    // Тест для calculateGPsg2
    describe('calculateGPsg2', function () {
        it('should correctly calculate GPsg2 and handle errors', function () {
            // Перевіряємо результат для G_sv = 4200, Bypass_percent = 0.1
            const result = calculateGPsg2(4200, 0.1);
            expect(result).to.equal(3780);

            // Перевірка на помилку для занадто низького значення
            expect(() => calculateGPsg2(1500, 0.1)).to.throw(
                "Ви досягли нижньої межі. Закрийте байпас ПСГ-1 або збільшіть витрату охолоджувальної пари."
            );

            // Перевірка на помилку для занадто високого значення
            expect(() => calculateGPsg2(6000, 0.1)).to.throw(
                "Ви досягли верхньої межі. Відкрийте байпас ПСГ-1 або зменшіть витрату охолоджувальної пари."
            );
        });
    });

    // Тест для calculateTPsg2
    describe('calculateTPsg2', function () { //t2, Qt, G_psg2
        it('should correctly calculate TPsg2', function () {
            // Перевіряємо результат для t2 = 50, Qt = 157.2286, G_psg2 = 3780
            expect(calculateTPsg2(50, 157.2286, 3780)).to.be.closeTo(91.59487, 0.01);
        });
    });

    // Тест для calculatePt
    describe('calculatePt', function () {
        it('should correctly calculate Pt and handle errors', function () {
            // Перевіряємо результат для t1 = 87.43538
            expect(calculatePt(87.43538)).to.be.closeTo(0.875, 0.01);

            // Перевірка на помилку для низького тиску
            expect(() => calculatePt(1)).to.throw(
                "Тиск у відборі низький. Відкрийте діафрагму або закрийте подачу пари ПСГ-2."
            );

            // Перевірка на помилку для високого тиску
            expect(() => calculatePt(200)).to.throw(
                "Тиск у відборі високий. Закрийте діафрагму або збільшіть навантаження енергоблоку."
            );
        });
    });

    // Тест для calculateQo
    describe('calculateQo', function () { //Vt_percent, pt, Qt
        it('should correctly calculate Qo', function () {
            // Вхідні дані: Vt_percent = 0.9, pt = 0.875124, Qt = 157.2286
            expect(calculateQo(0.9, 0.875124, 157.2286)).to.be.closeTo(241.1432, 0.01);
        });
    });

    // Тест для calculateNe
    describe('calculateNe', function () { //qo, pt, Qt
        it('should correctly calculate Ne', function () {
            // Вхідні дані: qo = 241.1432, pt = 0.875124, Qt = 157.2286
            expect(calculateNe(241.1432, 0.875124, 157.2286)).to.be.closeTo(83.75, 0.01);
        });
    });

    // Тест для calculateQt_2
    describe('calculateQt_2', function () {
        it('should return 0', function () {
            // Заслонка закрита, очікується 0
            expect(calculateQt_2()).to.equal(0);
        });
    });

    // Тест для calculateNe_2
    describe('calculateNe_2', function () {
        it('should correctly calculate Ne when заслонка closed', function () {
            // Вхідні дані: Vt_percent = 0.9
            expect(calculateNe_2(0.9)).to.be.closeTo(265.244, 0.01);
        });
    });

    // Тест для calculateNtp
    describe('calculateNtp', function () {
        it('should correctly calculate Ntp', function () {
            // Вхідні дані: qo = 200
            expect(calculateNtp(241.1432)).to.be.closeTo(1.81, 0.01);
        });
    });
});

describe('Calculation Module Tests with Twin', function () {
    let spy;

    //afterEach(() => {
        // Відновлюємо початковий стан після кожного тесту
    //    if (spy) spy.restore();
    //});

    // 1. Тест для calculateVt
    describe('calculateVt', function () {
        it('should correctly calculate Vt', function () {
            spy = sinon.spy(calculateVt);
            const result = spy(0.8); // Vt_percent = 0.8
            expect(result).to.be.closeTo(65.6, 0.0001);
            expect(spy.calledOnce).to.be.true;
            expect(spy.calledWith(0.8)).to.be.true;
        });
    });

    // 2. Тест для calculateQt
    describe('calculateQt', function () {
        it('should correctly calculate Qt', function () {
            spy = sinon.spy(calculateQt);
            const result = spy(0.8, 0.2); // Вхідні значення: Vt_percent=0.8, UP_percent=0.2
            expect(result).to.be.a('number');
            expect(result).to.be.closeTo(198.118, 0.01);
            expect(spy.calledOnce).to.be.true;
            expect(spy.calledWith(0.8, 0.2)).to.be.true;
        });
    });

    // 3. Тест для calculateT1
    describe('calculateT1', function () {
        it('should correctly calculate t1', function () {
            spy = sinon.spy(calculateT1);
            const result = spy(40, 198.118, 4500); // t2=40, Qt=198.118, G_sv=4500
            expect(result).to.be.closeTo(84.02622, 0.001);
            expect(spy.calledOnce).to.be.true;
            expect(spy.calledWith(40, 198.118, 4500)).to.be.true;
        });
    });

    // 4. Тест для calculateGBypass
    describe('calculateGBypass', function () {
        it('should correctly calculate GBypass', function () {
            spy = sinon.spy(calculateGBypass);
            const result = spy(4500, 0); // G_sv=4500, Bypass_percent=0
            expect(result).to.equal(0);
            expect(spy.calledOnce).to.be.true;
            expect(spy.calledWith(4500, 0)).to.be.true;
        });
    });

    // 5. Тест для calculateGPsg2
    describe('calculateGPsg2', function () {
        it('should correctly calculate GPsg2 and handle errors', function () {
            spy = sinon.spy(calculateGPsg2);

            // Правильне значення
            const result = spy(4500, 0); // G_sv=4200, Bypass_percent=0.1
            expect(result).to.equal(4500);
            expect(spy.calledOnce).to.be.true;
            expect(spy.calledWith(4500, 0)).to.be.true;

            // Низьке значення
            expect(() => spy(1500, 0.1)).to.throw(
                "Ви досягли нижньої межі. Закрийте байпас ПСГ-1 або збільшіть витрату охолоджувальної пари."
            );

            // Високе значення
            expect(() => spy(6000, 0.1)).to.throw(
                "Ви досягли верхньої межі. Відкрийте байпас ПСГ-1 або зменшіть витрату охолоджувальної пари."
            );
        });
    });

    // 6. Тест для calculateTPsg2
    describe('calculateTPsg2', function () {
        it('should correctly calculate TPsg2', function () {
            spy = sinon.spy(calculateTPsg2);
            const result = spy(40, 198.118,4500 ); // t2 = 40 , Qt = 198.118 , G_psg2 =4500
            expect(result).to.be.closeTo(84.026, 0.02);
            expect(spy.calledOnce).to.be.true;
            expect(spy.calledWith(40, 198.118,4500)).to.be.true;
        });
    });

    // 7. Тест для calculatePt
    describe('calculatePt', function () {
        it('should correctly calculate Pt and handle errors', function () {
            spy = sinon.spy(calculatePt);

            // Правильне значення
            const result = spy(84.02622); // t1=87.43538
            expect(result).to.be.closeTo(0.795, 0.01);
            expect(spy.calledOnce).to.be.true;
            expect(spy.calledWith(84.02622)).to.be.true;

            // Низький тиск
            expect(() => spy(1)).to.throw(
                "Тиск у відборі низький. Відкрийте діафрагму або закрийте подачу пари ПСГ-2."
            );

            // Високий тиск
            expect(() => spy(200)).to.throw(
                "Тиск у відборі високий. Закрийте діафрагму або збільшіть навантаження енергоблоку."
            );
        });
    });

    // 8. Тест для calculateQo
    describe('calculateQo', function () {
        it('should correctly calculate Qo', function () {
            spy = sinon.spy(calculateQo);
            const result = spy(0.8, 0.795, 198.118); // Vt_percent=0.8, pt=0.795, Qt=198.118
            expect(result).to.be.closeTo(269.87, 0.01);
            expect(spy.calledOnce).to.be.true;
            expect(spy.calledWith(0.8, 0.795, 198.118)).to.be.true;
        });
    });

    // 9. Тест для calculateNe
    describe('calculateNe', function () {
        it('should correctly calculate Ne', function () {
            spy = sinon.spy(calculateNe);
            const result = spy(269.87, 0.795, 198.118); // qo=269.87, pt=0.795, Qt=198.118
            expect(result).to.be.closeTo(92.775, 0.01);
            expect(spy.calledOnce).to.be.true;
            expect(spy.calledWith(269.87, 0.795, 198.118)).to.be.true;
        });
    });

    // 10. Тест для calculateQt_2
    describe('calculateQt_2', function () {
        it('should correctly calculate Qt_2', function () {
            spy = sinon.spy(calculateQt_2);
            const result = spy(); 
            expect(result).to.equal(0);
            expect(spy.calledOnce).to.be.true;
            expect(spy.calledWith()).to.be.true;
        });
    });

    // 11. Тест для calculateNtp
    describe('calculateNe_2', function () {
        it('should correctly calculate Ne_2', function () {
            spy = sinon.spy(calculateNe_2);
            const result = spy(0.8); // Vt_percent = 0.8
            expect(result).to.be.closeTo(234.823, 0.01);
            expect(spy.calledOnce).to.be.true;
            expect(spy.calledWith(0.8)).to.be.true;
        });
    });

    // 12. Тест для calculateNtp
    describe('calculateNtp', function () {
        it('should correctly calculate Ntp', function () {
            spy = sinon.spy(calculateNtp);
            const result = spy(269.87); // qo = 269.87
            expect(result).to.be.closeTo(2.59, 0.02);
            expect(spy.calledOnce).to.be.true;
            expect(spy.calledWith(269.87)).to.be.true;
        });
    });
});*/