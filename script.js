(function() {
    // ----- SET A: Fear vs Opportunity -----
    const ROUNDS_DATA = [
        { year: "2008", label: "Financial crisis", returns: { "USA Eq": -37.0, "Europe Eq": -45.0, "Japan Eq": -42.1, "China Eq": -51.0, "USA FI": 5.2, "Europe FI": 6.1, "Japan FI": 3.4, "China FI": 9.0, "Cash": 1.4 } },
        { year: "2017", label: "Growth optimism", returns: { "USA Eq": 21.8, "Europe Eq": 25.0, "Japan Eq": 19.1, "China Eq": 54.0, "USA FI": 3.5, "Europe FI": 0.6, "Japan FI": 0.2, "China FI": -1.2, "Cash": 0.8 } },
        { year: "2020", label: "Pandemic shock", returns: { "USA Eq": 18.4, "Europe Eq": 5.0, "Japan Eq": 16.0, "China Eq": 30.0, "USA FI": 7.5, "Europe FI": 4.1, "Japan FI": 0.7, "China FI": 3.5, "Cash": 0.5 } },
        { year: "2012", label: "Stabilisation", returns: { "USA Eq": 16.0, "Europe Eq": 19.0, "Japan Eq": 22.9, "China Eq": 19.0, "USA FI": 4.2, "Europe FI": 10.3, "Japan FI": 1.8, "China FI": 4.0, "Cash": 0.1 } },
        { year: "2022", label: "Inflation & tightening", returns: { "USA Eq": -18.1, "Europe Eq": -15.0, "Japan Eq": -9.4, "China Eq": -22.0, "USA FI": -13.0, "Europe FI": -17.2, "Japan FI": -5.3, "China FI": 3.1, "Cash": 1.5 } },
        { year: "2009", label: "Recovery or trap", returns: { "USA Eq": 26.5, "Europe Eq": 32.0, "Japan Eq": 19.0, "China Eq": 62.0, "USA FI": 5.9, "Europe FI": 5.6, "Japan FI": 1.4, "China FI": 1.4, "Cash": 0.1 } },
        { year: "2024", label: "Momentum vs diversification", returns: { "USA Eq": 25.0, "Europe Eq": 9.0, "Japan Eq": 19.2, "China Eq": 20.0, "USA FI": 1.2, "Europe FI": 1.8, "Japan FI": -2.0, "China FI": 5.5, "Cash": 5.1 } }
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
    const detailTableWrap = document.getElementById('detailTableWrap');
    const detailBody = document.getElementById('detailBody');
    const reflectionText = document.getElementById('reflectionText');

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

    function fmt(v) { return Number(v).toFixed(2); }
    function getRoundData() { return ROUNDS_DATA[currentRound]; }
    function getAssetNames() { return Object.keys(getRoundData().returns); }

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
        
        updateRoundHeader();
        renderAssets();
        renderHistory();
        
        resultBlock.style.display = 'none';
        detailTableWrap.style.display = 'none';
        
        submitBtn.disabled = false;
        submitBtn.textContent = '✅ Done — reveal returns';
        globalError.textContent = '';
        yearTag.textContent = '??? · Hidden year';
        
        refreshUI();
        
        globalError.textContent = '✅ Game reset successfully! Starting fresh with $10,000.';
        globalError.style.color = '#0b6e3f';
        setTimeout(() => {
            globalError.textContent = '';
            globalError.style.color = '#b91c1c';
        }, 3000);
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

    // ----- Quick Actions -----
    function applyQuickAction(type) {
        const assetNames = getAssetNames();
        
        if (type === 'equal') {
            const pct = 100 / assetNames.length;
            assetNames.forEach(name => {
                const val = (pct / 100) * capital;
                inputValues[name] = { dollar: val, percent: pct };
            });
        } else if (type === 'cash') {
            assetNames.forEach(name => {
                const val = name === 'Cash' ? capital : 0;
                const pct = name === 'Cash' ? 100 : 0;
                inputValues[name] = { dollar: val, percent: pct };
            });
        } else if (type === 'equity') {
            const equityAssets = ['USA Eq', 'Europe Eq', 'Japan Eq', 'China Eq'];
            const fiAssets = ['USA FI', 'Europe FI', 'Japan FI', 'China FI'];
            
            const equityPct = 70;
            const fiPct = 30;
            const equityEach = equityPct / equityAssets.length;
            const fiEach = fiPct / fiAssets.length;
            
            assetNames.forEach(name => {
                let val = 0;
                let pct = 0;
                if (equityAssets.includes(name)) {
                    pct = equityEach;
                    val = (equityEach / 100) * capital;
                } else if (fiAssets.includes(name)) {
                    pct = fiEach;
                    val = (fiEach / 100) * capital;
                } else if (name === 'Cash') {
                    pct = 0;
                    val = 0;
                }
                inputValues[name] = { dollar: val, percent: pct };
            });
        } else if (type === 'defensive') {
            const equityAssets = ['USA Eq', 'Europe Eq', 'Japan Eq', 'China Eq'];
            const fiAssets = ['USA FI', 'Europe FI', 'Japan FI', 'China FI'];
            
            const equityPct = 30;
            const fiPct = 70;
            const equityEach = equityPct / equityAssets.length;
            const fiEach = fiPct / fiAssets.length;
            
            assetNames.forEach(name => {
                let val = 0;
                let pct = 0;
                if (equityAssets.includes(name)) {
                    pct = equityEach;
                    val = (equityEach / 100) * capital;
                } else if (fiAssets.includes(name)) {
                    pct = fiEach;
                    val = (fiEach / 100) * capital;
                } else if (name === 'Cash') {
                    pct = 0;
                    val = 0;
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
        
        // Initialize inputValues if needed
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
            } else { // both mode
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
            
            html += `
                <div class="asset-item">
                    <span class="label">${name}</span>
                    <span class="hidden-badge">${isCash ? '💵 cash' : '🔒 hidden'}</span>
                    ${inputFields}
                </div>
            `;
        }
        
        // Set the HTML
        assetGrid.innerHTML = html;
        
        // Re-attach event listeners
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
                    if (val > capital) {
                        this.classList.add('error');
                    } else {
                        this.classList.remove('error');
                    }
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
                    if (val > 100) {
                        this.classList.add('error');
                    } else {
                        this.classList.remove('error');
                    }
                    inputValues[assetName].percent = val;
                    if (currentMode === 'both') {
                        const dollarAmt = (val / 100) * capital;
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
            
            if (inputs[name]?.dollar) {
                if (dollarVal > capital) {
                    inputs[name].dollar.classList.add('error');
                } else {
                    inputs[name].dollar.classList.remove('error');
                }
            }
            if (inputs[name]?.percent) {
                if (percentVal > 100) {
                    inputs[name].percent.classList.add('error');
                } else {
                    inputs[name].percent.classList.remove('error');
                }
            }
        }
        
        const remaining = Math.max(0, capital - sumDollar);
        remainingDisplay.textContent = fmt(remaining);
        allocatedSumDisplay.textContent = fmt(sumDollar);
        
        let errorMsg = '';
        if (sumDollar > capital) {
            errorMsg = `⚠️ Total allocation ($${fmt(sumDollar)}) exceeds capital ($${fmt(capital)}).`;
        } else if ((currentMode === 'percent' || currentMode === 'both') && sumDollar > 0) {
            if (Math.abs(sumPercent - 100) > 0.5) {
                errorMsg = `⚠️ Total percentage (${sumPercent.toFixed(1)}%) doesn't equal 100%.`;
            }
        }
        
        for (let name of assetNames) {
            if (inputValues[name]?.dollar > capital) {
                errorMsg = `⚠️ ${name} exceeds available capital ($${fmt(capital)}).`;
                break;
            }
        }
        
        globalError.textContent = errorMsg;
        submitBtn.disabled = (errorMsg.length > 0 || sumDollar === 0);
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
                dollarAmt = (pct / 100) * capital;
            } else if (currentMode === 'both') {
                const dollarInput = inputs[name]?.dollar;
                const pctInput = inputs[name]?.percent;
                const dollarVal = parseFloat(dollarInput?.value) || 0;
                const pctVal = parseFloat(pctInput?.value) || 0;
                
                if (dollarVal > 0) {
                    dollarAmt = dollarVal;
                } else if (pctVal > 0) {
                    dollarAmt = (pctVal / 100) * capital;
                } else {
                    dollarAmt = 0;
                }
                inputValues[name].dollar = dollarAmt;
                inputValues[name].percent = capital > 0 ? (dollarAmt / capital) * 100 : 0;
            }
            
            dollarAmt = Math.round(dollarAmt * 100) / 100;
            
            if (dollarAmt > capital) {
                error = true;
            }
            allocated += dollarAmt;
            allocationMap[name] = dollarAmt;
        }

        allocated = Math.round(allocated * 100) / 100;

        if (error || allocated > capital || allocated === 0) {
            globalError.textContent = error ? '⚠️ Allocation exceeds capital.' : '⚠️ Allocate at least some capital.';
            return;
        }

        const remaining = Math.round((capital - allocated) * 100) / 100;
        if (remaining > 0.01) {
            allocationMap['Cash'] = (allocationMap['Cash'] || 0) + remaining;
            allocated = capital;
        }

        let totalReturn = 0;
        for (let name of assetNames) {
            const ret = returns[name] / 100;
            totalReturn += allocationMap[name] * ret;
        }
        const returnPercent = (totalReturn / capital) * 100;
        const newCapital = capital + totalReturn;

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

        renderDetailTable(allocationMap, returns, capital);
        reflectionText.textContent = 'What surprised you? What would you change next round?';

        capital = newCapital;

        saveAllData();

        if (currentRound < ROUNDS_DATA.length - 1) {
            currentRound++;
            updateRoundHeader();
            renderAssets();
            resultBlock.style.display = 'none';
            detailTableWrap.style.display = 'none';
            renderHistory();
            globalError.textContent = '';
        } else {
            submitBtn.disabled = true;
            submitBtn.textContent = '🏁 Game Over';
            globalError.textContent = '🎉 All 7 rounds completed! Check your final capital above.';
            renderHistory();
        }
        refreshUI();
    }

    function renderDetailTable(allocationMap, returnsMap, totalCapital) {
        const assetNames = getAssetNames();
        let rows = '';
        let totalAllocPct = 0, totalAllocDol = 0, totalEndVal = 0;
        for (let name of assetNames) {
            const allocDol = allocationMap[name] || 0;
            const allocPct = totalCapital > 0 ? (allocDol / totalCapital) * 100 : 0;
            const ret = returnsMap[name] || 0;
            const endVal = allocDol * (1 + ret / 100);
            totalAllocPct += allocPct;
            totalAllocDol += allocDol;
            totalEndVal += endVal;
            const retStr = ret >= 0 ? `+${fmt(ret)}` : fmt(ret);
            rows += `
                <tr>
                    <td class="asset-label">${name}</td>
                    <td>${fmt(allocPct)}%</td>
                    <td>${fmt(allocDol)}</td>
                    <td>${retStr}%</td>
                    <td>${fmt(endVal)}</td>
                </tr>
            `;
        }
        rows += `
            <tr class="total-row">
                <td class="asset-label"><strong>TOTAL</strong></td>
                <td>${fmt(totalAllocPct)}%</td>
                <td>${fmt(totalAllocDol)}</td>
                <td>—</td>
                <td><strong>${fmt(totalEndVal)}</strong></td>
            </tr>
        `;
        detailBody.innerHTML = rows;
        detailTableWrap.style.display = 'block';
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
        detailTableWrap.style.display = 'none';
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
                        renderDetailTable(last.allocation, last.returns, capital - last.returnAmount);
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
        detailTableWrap.style.display = 'none';
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

    function performReset() {
    currentRound = 0;
    capital = 10000.0;
    history = [];
    allRoundReturns = [];
    
    const assetNames = getAssetNames();
    assetNames.forEach(name => {
        inputValues[name] = { dollar: 0, percent: 0 };
    });
    
    // Clear localStorage
    localStorage.removeItem('gameHistory');
    localStorage.removeItem('currentCapital');
    localStorage.removeItem('allRoundReturns');
    localStorage.removeItem('gameData');
    
    // TRIGGER STORAGE EVENT FOR OTHER PAGES
    // This tells the Results and Portfolio pages to refresh
    localStorage.setItem('gameReset', Date.now().toString());
    
    // Update UI
    updateRoundHeader();
    renderAssets();
    renderHistory();
    
    resultBlock.style.display = 'none';
    detailTableWrap.style.display = 'none';
    
    submitBtn.disabled = false;
    submitBtn.textContent = '✅ Done — reveal returns';
    globalError.textContent = '';
    yearTag.textContent = '??? · Hidden year';
    
    refreshUI();
    
    globalError.textContent = '✅ Game reset successfully! Starting fresh with $10,000.';
    globalError.style.color = '#0b6e3f';
    setTimeout(() => {
        globalError.textContent = '';
        globalError.style.color = '#b91c1c';
    }, 3000);
}

    // ----- Start -----
    init();
})();
