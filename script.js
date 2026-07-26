(function() {
    // ----- SET A: Fear vs Opportunity - 6 Rounds, 6 Assets -----
    const ROUNDS_DATA = [
        { 
            year: "2008", 
            label: "Global financial crisis", 
            returns: { 
                "US EQ": -37.0, 
                "Europe EQ": -45.0, 
                "China EQ": -65.4, 
                "Global Bonds": 5.2, 
                "Gold": 5.5, 
                "Cash": 1.4 
            } 
        },
        { 
            year: "2017", 
            label: "Growth optimism", 
            returns: { 
                "US EQ": 21.8, 
                "Europe EQ": 25.0, 
                "China EQ": 54.1, 
                "Global Bonds": 7.4, 
                "Gold": 13.7, 
                "Cash": 0.8 
            } 
        },
        { 
            year: "2020", 
            label: "Pandemic shock", 
            returns: { 
                "US EQ": 18.4, 
                "Europe EQ": 5.0, 
                "China EQ": 29.5, 
                "Global Bonds": 9.2, 
                "Gold": 24.6, 
                "Cash": 0.6 
            } 
        },
        { 
            year: "2012", 
            label: "Stabilisation", 
            returns: { 
                "US EQ": 16.0, 
                "Europe EQ": 19.0, 
                "China EQ": 14.3, 
                "Global Bonds": 4.2, 
                "Gold": 7.1, 
                "Cash": 0.1 
            } 
        },
        { 
            year: "2022", 
            label: "Inflation & tightening", 
            returns: { 
                "US EQ": -18.1, 
                "Europe EQ": -15.0, 
                "China EQ": -21.8, 
                "Global Bonds": -16.2, 
                "Gold": 0.4, 
                "Cash": 2.1 
            } 
        },
        { 
            year: "2024", 
            label: "Momentum vs diversification", 
            returns: { 
                "US EQ": 24.2, 
                "Europe EQ": 9.0, 
                "China EQ": 16.4, 
                "Global Bonds": 2.8, 
                "Gold": 27.4, 
                "Cash": 5.1 
            } 
        }
    ];

    let currentRound = 0;
    let capital = 10000.0;
    let history = [];
    let allRoundReturns = [];
    let currentMode = 'dollar';

    // DOM refs
    const roundLabel = document.getElementById('roundLabel');
    const yearTag = document.getElementById('yearTag');
    const capitalDisplay = document.getElementById('capitalDisplay');
    const remainingDisplay = document.getElementById('remainingDisplay');
    const assetGrid = document.getElementById('assetGrid');
    const globalError = document.getElementById('globalError');
    const allocatedSumDisplay = document.getElementById('allocatedSumDisplay');
    const submitBtn = document.getElementById('submitRoundBtn');
    const resetBtn = document.getElementById('resetRoundBtn');
    const resetAllBtn = document.getElementById('resetAllBtn');
    const resultBlock = document.getElementById('resultBlock');
    const returnAmountDisplay = document.getElementById('returnAmountDisplay');
    const returnPercentDisplay = document.getElementById('returnPercentDisplay');
    const newCapitalDisplay = document.getElementById('newCapitalDisplay');
    const historyEntries = document.getElementById('historyEntries');

    // Mode buttons
    const modeDollar = document.getElementById('modeDollar');
    const modePercent = document.getElementById('modePercent');
    const modeBoth = document.getElementById('modeBoth');

    // Quick action buttons
    const equalAlloc = document.getElementById('equalAlloc');
    const cashOnly = document.getElementById('cashOnly');
    const equityHeavy = document.getElementById('equityHeavy');
    const defensive = document.getElementById('defensive');
    const clearAll = document.getElementById('clearAll');

    let inputs = {};
    let inputValues = {};

    function fmt(v) { 
        return Number(v).toFixed(2); 
    }
    
    function roundToTwo(v) {
        return Math.round(v * 100) / 100;
    }

    function getRoundData() { return ROUNDS_DATA[currentRound]; }
    function getAssetNames() { return Object.keys(getRoundData().returns); }

    // TOLERANCE for rounding errors
    const TOLERANCE = 0.10;

    // ----- Reset All Game -----
    function resetAllGame() {
        if (history.length === 0) {
            performReset();
            return;
        }
        
        if (confirm('⚠️ Are you sure you want to reset the entire game?\n\nThis will delete all your progress, history, and start you back at Round 1 with $10,000.\n\nThis action cannot be undone!')) {
            performReset();
        }
    }

    function performReset() {
        currentRound = 0;
        capital = 10000.0;
        history = [];
        allRoundReturns = [];
        
        const assetNames = getAssetNames();
        assetNames.forEach(name => {
            inputValues[name] = { dollar: 0, percent: 0 };
        });
        
        localStorage.removeItem('gameHistory');
        localStorage.removeItem('currentCapital');
        localStorage.removeItem('allRoundReturns');
        localStorage.removeItem('gameData');
        localStorage.setItem('gameReset', Date.now().toString());
        
        updateRoundHeader();
        renderAssets();
        renderHistory();
        
        resultBlock.style.display = 'none';
        
        submitBtn.disabled = false;
        submitBtn.textContent = '✅ Done — reveal returns';
        globalError.textContent = '';
        yearTag.textContent = '??? · Hidden year';
        
        refreshUI();
    }

    // ----- Input Mode Management -----
    function setMode(mode) {
        currentMode = mode;
        [modeDollar, modePercent, modeBoth].forEach(btn => {
            btn.classList.remove('active');
        });
        if (mode === 'dollar') modeDollar.classList.add('active');
        else if (mode === 'percent') modePercent.classList.add('active');
        else if (mode === 'both') modeBoth.classList.add('active');
        
        renderAssets();
    }

    // ----- Quick Actions - UPDATED FOR 6 ASSETS -----
    function applyQuickAction(type) {
        const assetNames = getAssetNames();
        
        if (type === 'equal') {
            const pct = 100 / assetNames.length;
            assetNames.forEach(name => {
                const val = roundToTwo((pct / 100) * capital);
                inputValues[name] = { dollar: val, percent: pct };
            });
        } else if (type === 'cash') {
            assetNames.forEach(name => {
                const val = name === 'Cash' ? capital : 0;
                const pct = name === 'Cash' ? 100 : 0;
                inputValues[name] = { dollar: roundToTwo(val), percent: pct };
            });
        } else if (type === 'equity') {
            // Growth: 60% Equities, 20% Bonds, 10% Gold, 10% Cash
            const equityAssets = ['US EQ', 'Europe EQ', 'China EQ'];
            const equityPct = 60;
            const bondsPct = 20;
            const goldPct = 10;
            const cashPct = 10;
            
            const equityEach = equityPct / equityAssets.length;
            
            assetNames.forEach(name => {
                let val = 0;
                let pct = 0;
                if (equityAssets.includes(name)) {
                    pct = equityEach;
                    val = roundToTwo((equityEach / 100) * capital);
                } else if (name === 'Global Bonds') {
                    pct = bondsPct;
                    val = roundToTwo((bondsPct / 100) * capital);
                } else if (name === 'Gold') {
                    pct = goldPct;
                    val = roundToTwo((goldPct / 100) * capital);
                } else if (name === 'Cash') {
                    pct = cashPct;
                    val = roundToTwo((cashPct / 100) * capital);
                }
                inputValues[name] = { dollar: val, percent: pct };
            });
        } else if (type === 'defensive') {
            // Defensive: 20% Equities, 30% Bonds, 20% Gold, 30% Cash
            const equityAssets = ['US EQ', 'Europe EQ', 'China EQ'];
            const equityPct = 20;
            const bondsPct = 30;
            const goldPct = 20;
            const cashPct = 30;
            
            const equityEach = equityPct / equityAssets.length;
            
            assetNames.forEach(name => {
                let val = 0;
                let pct = 0;
                if (equityAssets.includes(name)) {
                    pct = equityEach;
                    val = roundToTwo((equityEach / 100) * capital);
                } else if (name === 'Global Bonds') {
                    pct = bondsPct;
                    val = roundToTwo((bondsPct / 100) * capital);
                } else if (name === 'Gold') {
                    pct = goldPct;
                    val = roundToTwo((goldPct / 100) * capital);
                } else if (name === 'Cash') {
                    pct = cashPct;
                    val = roundToTwo((cashPct / 100) * capital);
                }
                inputValues[name] = { dollar: val, percent: pct };
            });
        } else if (type === 'clear') {
            assetNames.forEach(name => {
                inputValues[name] = { dollar: 0, percent: 0 };
            });
        }
        renderAssets();
        refreshUI();
    }

    // ----- Render Assets with Dual Input -----
    function renderAssets() {
        const assetNames = getAssetNames();
        let html = '';
        
        if (Object.keys(inputValues).length === 0) {
            assetNames.forEach(name => {
                inputValues[name] = { dollar: 0, percent: 0 };
            });
        }
        
        for (let name of assetNames) {
            const isCash = name === 'Cash';
            const dollarVal = inputValues[name]?.dollar || 0;
            const percentVal = inputValues[name]?.percent || 0;
            
            let inputFields = '';
            
            if (currentMode === 'dollar') {
                inputFields = `
                    <div class="input-group">
                        <span class="dollar-symbol">$</span>
                        <input type="number" step="0.01" min="0" data-asset="${name}" data-field="dollar" value="${fmt(dollarVal)}" placeholder="0.00">
                    </div>
                `;
            } else if (currentMode === 'percent') {
                inputFields = `
                    <div class="input-group">
                        <input type="number" step="0.1" min="0" max="100" data-asset="${name}" data-field="percent" value="${percentVal.toFixed(1)}" placeholder="0.0">
                        <span class="percent-symbol">%</span>
                    </div>
                `;
            } else {
                inputFields = `
                    <div class="input-group">
                        <span class="dollar-symbol">$</span>
                        <input type="number" step="0.01" min="0" data-asset="${name}" data-field="dollar" value="${fmt(dollarVal)}" placeholder="0.00">
                        <span class="or-text">or</span>
                        <input type="number" step="0.1" min="0" max="100" data-asset="${name}" data-field="percent" value="${percentVal.toFixed(1)}" placeholder="0.0">
                        <span class="percent-symbol">%</span>
                    </div>
                `;
            }
            
            const displayPct = capital > 0 ? (dollarVal / capital) * 100 : 0;
            
            html += `
                <div class="asset-item">
                    <span class="label">${name}</span>
                    <span class="hidden-badge">${isCash ? '💵 cash' : '🔒 hidden'}</span>
                    ${inputFields}
                    <span class="pct-display" style="font-size:0.65rem; color:#6b8a9e; min-width:35px; text-align:right;">
                        ${displayPct > 0 ? displayPct.toFixed(1) + '%' : ''}
                    </span>
                </div>
            `;
        }
        
        assetGrid.innerHTML = html;
        
        inputs = {};
        document.querySelectorAll('.asset-item input').forEach(inp => {
            const name = inp.dataset.asset;
            const field = inp.dataset.field;
            
            if (!inputs[name]) {
                inputs[name] = {};
            }
            inputs[name][field] = inp;
            
            inp.addEventListener('input', function(e) {
                const assetName = this.dataset.asset;
                const fieldName = this.dataset.field;
                let val = parseFloat(this.value);
                if (isNaN(val) || val < 0) val = 0;
                
                if (fieldName === 'dollar') {
                    val = roundToTwo(val);
                    inputValues[assetName].dollar = val;
                    if (currentMode === 'both') {
                        const pct = capital > 0 ? (val / capital) * 100 : 0;
                        inputValues[assetName].percent = pct;
                        const pctInput = inputs[assetName]?.percent;
                        if (pctInput && pctInput !== this) {
                            pctInput.value = pct.toFixed(1);
                        }
                    }
                } else if (fieldName === 'percent') {
                    inputValues[assetName].percent = val;
                    if (currentMode === 'both') {
                        const dollarAmt = roundToTwo((val / 100) * capital);
                        inputValues[assetName].dollar = dollarAmt;
                        const dollarInput = inputs[assetName]?.dollar;
                        if (dollarInput && dollarInput !== this) {
                            dollarInput.value = fmt(dollarAmt);
                        }
                    }
                }
                refreshUI();
            });
            
            inp.addEventListener('blur', function() {
                let val = parseFloat(this.value);
                if (isNaN(val) || val < 0) val = 0;
                if (this.dataset.field === 'dollar') {
                    val = roundToTwo(val);
                    this.value = fmt(val);
                } else {
                    this.value = val.toFixed(1);
                }
                refreshUI();
            });
        });
        
        refreshUI();
    }

    // ----- Refresh UI -----
    function refreshUI() {
        capitalDisplay.textContent = fmt(capital);
        
        let sumDollar = 0;
        let sumPercent = 0;
        const assetNames = getAssetNames();
        
        for (let name of assetNames) {
            const dollarVal = inputValues[name]?.dollar || 0;
            const percentVal = inputValues[name]?.percent || 0;
            sumDollar += dollarVal;
            sumPercent += percentVal;
        }
        
        sumDollar = roundToTwo(sumDollar);
        
        const remaining = roundToTwo(Math.max(0, capital - sumDollar));
        remainingDisplay.textContent = fmt(remaining);
        allocatedSumDisplay.textContent = fmt(sumDollar);
        
        // Update percentage displays
        document.querySelectorAll('.asset-item').forEach((item, index) => {
            const pctDisplay = item.querySelector('.pct-display');
            if (pctDisplay) {
                const assetName = assetNames[index];
                const dollarVal = inputValues[assetName]?.dollar || 0;
                const pct = capital > 0 ? (dollarVal / capital) * 100 : 0;
                pctDisplay.textContent = pct > 0 ? pct.toFixed(1) + '%' : '';
            }
        });
        
        let errorMsg = '';
        if (sumDollar > capital + TOLERANCE) {
            errorMsg = `⚠️ Total allocation ($${fmt(sumDollar)}) exceeds capital ($${fmt(capital)}).`;
        } else if ((currentMode === 'percent' || currentMode === 'both') && sumDollar > 0.01) {
            if (Math.abs(sumPercent - 100) > 1) {
                errorMsg = `⚠️ Total percentage (${sumPercent.toFixed(1)}%) doesn't equal 100%.`;
            }
        }
        
        globalError.textContent = errorMsg;
        submitBtn.disabled = (errorMsg.length > 0 || sumDollar < 0.01);
    }

    // ----- Submit Allocation -----
    function submitAllocation() {
        const assetNames = getAssetNames();
        const returns = getRoundData().returns;
        let allocated = 0;
        let allocationMap = {};
        let error = false;

        for (let name of assetNames) {
            let dollarAmt = inputValues[name]?.dollar || 0;
            
            if (currentMode === 'percent') {
                const pct = inputValues[name]?.percent || 0;
                dollarAmt = roundToTwo((pct / 100) * capital);
            } else if (currentMode === 'both') {
                const dollarInput = inputs[name]?.dollar;
                const pctInput = inputs[name]?.percent;
                const dollarVal = parseFloat(dollarInput?.value) || 0;
                const pctVal = parseFloat(pctInput?.value) || 0;
                
                if (dollarVal > 0) {
                    dollarAmt = roundToTwo(dollarVal);
                } else if (pctVal > 0) {
                    dollarAmt = roundToTwo((pctVal / 100) * capital);
                } else {
                    dollarAmt = 0;
                }
                inputValues[name].dollar = dollarAmt;
                inputValues[name].percent = capital > 0 ? (dollarAmt / capital) * 100 : 0;
            }
            
            dollarAmt = roundToTwo(dollarAmt);
            
            if (dollarAmt > capital + TOLERANCE) {
                error = true;
            }
            allocated += dollarAmt;
            allocationMap[name] = dollarAmt;
        }

        allocated = roundToTwo(allocated);

        if (error || allocated > capital + TOLERANCE || allocated < 0.01) {
            globalError.textContent = error ? '⚠️ Allocation exceeds capital.' : '⚠️ Allocate at least some capital.';
            return;
        }

        allocated = roundToTwo(allocated);
        const remaining = roundToTwo(capital - allocated);
        if (remaining > 0.01) {
            allocationMap['Cash'] = roundToTwo((allocationMap['Cash'] || 0) + remaining);
            allocated = capital;
        }

        let totalReturn = 0;
        for (let name of assetNames) {
            const ret = returns[name] / 100;
            totalReturn += allocationMap[name] * ret;
        }
        totalReturn = roundToTwo(totalReturn);
        const returnPercent = (totalReturn / capital) * 100;
        const newCapital = roundToTwo(capital + totalReturn);

        const data = getRoundData();
        yearTag.textContent = `${data.year} · ${data.label}`;

        const roundReturnData = {
            year: data.year,
            label: data.label,
            returns: { ...returns },
            allocations: { ...allocationMap },
            totalReturn: totalReturn,
            returnPercent: returnPercent,
            newCapital: newCapital
        };
        allRoundReturns.push(roundReturnData);

        history.push({
            round: currentRound + 1,
            year: data.year,
            label: data.label,
            allocation: { ...allocationMap },
            startCapital: capital,
            returnAmount: totalReturn,
            returnPercent: returnPercent,
            newCapital: newCapital,
            returns: { ...returns }
        });

        resultBlock.style.display = 'block';
        returnAmountDisplay.textContent = (totalReturn >= 0 ? '+' : '') + fmt(totalReturn);
        returnPercentDisplay.textContent = fmt(returnPercent) + '%';
        newCapitalDisplay.textContent = fmt(newCapital);

        capital = newCapital;

        saveAllData();

        // Clear inputs after submit
        const assetNamesClear = getAssetNames();
        assetNamesClear.forEach(name => {
            inputValues[name] = { dollar: 0, percent: 0 };
        });

        if (currentRound < ROUNDS_DATA.length - 1) {
            currentRound++;
            updateRoundHeader();
            renderAssets();
            resultBlock.style.display = 'block';
            renderHistory();
            globalError.textContent = '';
        } else {
            submitBtn.disabled = true;
            submitBtn.textContent = '🏁 Game Over';
            globalError.textContent = '🎉 All 6 rounds completed! Check your final capital above.';
            renderHistory();
        }
        refreshUI();
    }

    function saveAllData() {
        const data = {
            history: history,
            currentCapital: capital,
            allRoundReturns: allRoundReturns
        };
        
        localStorage.setItem('gameHistory', JSON.stringify(history));
        localStorage.setItem('currentCapital', capital.toString());
        localStorage.setItem('allRoundReturns', JSON.stringify(allRoundReturns));
        localStorage.setItem('gameData', JSON.stringify(data));
        
        try {
            fetch('/api/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            }).catch(e => console.log('Backend not available, using localStorage only'));
        } catch(e) {}
    }

    function updateRoundHeader() {
        roundLabel.textContent = `Round ${currentRound + 1}`;
        yearTag.textContent = `??? · Hidden year`;
    }

    function renderHistory() {
        if (history.length === 0) {
            historyEntries.innerHTML = `<span style="color:#4d6f8b;">— allocations & results will appear here</span>`;
            return;
        }
        let html = '';
        for (let h of history) {
            const allocStr = Object.entries(h.allocation)
                .filter(([k,v]) => v > 0)
                .map(([k,v]) => `${k}: ${fmt(v)}`)
                .join(' · ');
            html += `
                <div class="entry">
                    <span class="tag">R${h.round} (${h.year})</span>
                    <span>💰 ${fmt(h.returnAmount)} (${fmt(h.returnPercent)}%)</span>
                    <span>🔁 capital: ${fmt(h.newCapital)}</span>
                    <span style="font-size:0.8rem; color:#2b577a;">${allocStr}</span>
                </div>
            `;
        }
        historyEntries.innerHTML = html;
    }

    function resetRound() {
        const assetNames = getAssetNames();
        assetNames.forEach(name => {
            inputValues[name] = { dollar: 0, percent: 0 };
        });
        renderAssets();
        resultBlock.style.display = 'none';
        globalError.textContent = '';
        submitBtn.disabled = false;
        yearTag.textContent = `??? · Hidden year`;
        if (currentRound === ROUNDS_DATA.length - 1 && history.length === ROUNDS_DATA.length) {
            submitBtn.disabled = true;
            submitBtn.textContent = '🏁 Game Over';
        } else {
            submitBtn.textContent = '✅ Done — reveal returns';
        }
        refreshUI();
    }

    function init() {
        const savedData = localStorage.getItem('gameData');
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                if (data.history && data.history.length > 0) {
                    history = data.history;
                    capital = data.currentCapital || 10000.0;
                    allRoundReturns = data.allRoundReturns || [];
                    
                    if (history.length < ROUNDS_DATA.length) {
                        currentRound = history.length;
                    } else {
                        currentRound = ROUNDS_DATA.length - 1;
                        submitBtn.disabled = true;
                        submitBtn.textContent = '🏁 Game Over';
                    }
                    
                    const assetNames = getAssetNames();
                    assetNames.forEach(name => {
                        inputValues[name] = { dollar: 0, percent: 0 };
                    });
                    
                    updateRoundHeader();
                    renderAssets();
                    renderHistory();
                    refreshUI();
                    
                    if (history.length > 0) {
                        const last = history[history.length - 1];
                        yearTag.textContent = `${last.year} · ${last.label}`;
                        resultBlock.style.display = 'block';
                        returnAmountDisplay.textContent = (last.returnAmount >= 0 ? '+' : '') + fmt(last.returnAmount);
                        returnPercentDisplay.textContent = fmt(last.returnPercent) + '%';
                        newCapitalDisplay.textContent = fmt(last.newCapital);
                    }
                    return;
                }
            } catch(e) {
                console.log('Error loading saved data:', e);
            }
        }
        
        currentRound = 0;
        capital = 10000.0;
        history = [];
        allRoundReturns = [];
        const assetNames = getAssetNames();
        assetNames.forEach(name => {
            inputValues[name] = { dollar: 0, percent: 0 };
        });
        updateRoundHeader();
        renderAssets();
        renderHistory();
        resultBlock.style.display = 'none';
        submitBtn.disabled = false;
        submitBtn.textContent = '✅ Done — reveal returns';
        globalError.textContent = '';
        refreshUI();
    }

    // ----- Event Listeners -----
    modeDollar.addEventListener('click', () => setMode('dollar'));
    modePercent.addEventListener('click', () => setMode('percent'));
    modeBoth.addEventListener('click', () => setMode('both'));

    equalAlloc.addEventListener('click', () => applyQuickAction('equal'));
    cashOnly.addEventListener('click', () => applyQuickAction('cash'));
    equityHeavy.addEventListener('click', () => applyQuickAction('equity'));
    defensive.addEventListener('click', () => applyQuickAction('defensive'));
    clearAll.addEventListener('click', () => applyQuickAction('clear'));

    submitBtn.addEventListener('click', submitAllocation);
    resetBtn.addEventListener('click', resetRound);
    resetAllBtn.addEventListener('click', resetAllGame);

    // ----- Start -----
    init();
})();
