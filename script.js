(function() {
    // ----- ALL DATA SETS -----
    const ALL_SETS = {
        A: {
            name: "Fear vs Opportunity",
            subheader: "Set A · Fear vs Opportunity · 6 rounds · $10,000 start",
            rounds: [
                { year: "2008", label: "Global financial crisis", returns: { "US EQ": -37.0, "Europe EQ": -45.0, "China EQ": -65.4, "Global Bonds": 5.2, "Gold": 5.5, "Cash": 1.4 } },
                { year: "2017", label: "Growth optimism", returns: { "US EQ": 21.8, "Europe EQ": 25.0, "China EQ": 54.1, "Global Bonds": 7.4, "Gold": 13.7, "Cash": 0.8 } },
                { year: "2020", label: "Pandemic shock", returns: { "US EQ": 18.4, "Europe EQ": 5.0, "China EQ": 29.5, "Global Bonds": 9.2, "Gold": 24.6, "Cash": 0.6 } },
                { year: "2012", label: "Stabilisation", returns: { "US EQ": 16.0, "Europe EQ": 19.0, "China EQ": 14.3, "Global Bonds": 4.2, "Gold": 7.1, "Cash": 0.1 } },
                { year: "2022", label: "Inflation and tightening", returns: { "US EQ": -18.1, "Europe EQ": -15.0, "China EQ": -21.8, "Global Bonds": -16.2, "Gold": 0.4, "Cash": 2.1 } },
                { year: "2024", label: "Momentum vs diversification", returns: { "US EQ": 24.2, "Europe EQ": 9.0, "China EQ": 16.4, "Global Bonds": 2.8, "Gold": 27.4, "Cash": 5.1 } }
            ]
        },
        B: {
            name: "The Contrarian Test",
            subheader: "Set B · The Contrarian Test · 6 rounds · $10,000 start",
            rounds: [
                { year: "2011", label: "Risk-off sentiment", returns: { "US EQ": 2.1, "Europe EQ": -11.0, "China EQ": -21.7, "Global Bonds": 7.7, "Gold": 10.1, "Cash": 0.1 } },
                { year: "2021", label: "Reopening and inflation debate", returns: { "US EQ": 28.7, "Europe EQ": 16.0, "China EQ": -21.6, "Global Bonds": -4.7, "Gold": -3.6, "Cash": 0.1 } },
                { year: "2019", label: "Policy pivot expectations", returns: { "US EQ": 31.5, "Europe EQ": 24.0, "China EQ": 23.5, "Global Bonds": 6.8, "Gold": 18.3, "Cash": 2.2 } },
                { year: "2008", label: "Global financial crisis", returns: { "US EQ": -37.0, "Europe EQ": -45.0, "China EQ": -65.4, "Global Bonds": 5.2, "Gold": 5.5, "Cash": 1.4 } },
                { year: "2023", label: "Concentrated recovery", returns: { "US EQ": 26.3, "Europe EQ": 19.0, "China EQ": -11.2, "Global Bonds": 5.7, "Gold": 13.1, "Cash": 5.2 } },
                { year: "2013", label: "Liquidity-driven expansion", returns: { "US EQ": 32.4, "Europe EQ": 24.0, "China EQ": -2.6, "Global Bonds": -2.1, "Gold": -28.0, "Cash": 0.1 } }
            ]
        },
        C: {
            name: "Global Rotation",
            subheader: "Set C · Global Rotation · 6 rounds · $10,000 start",
            rounds: [
                { year: "2014", label: "Growth concerns", returns: { "US EQ": 13.7, "Europe EQ": -6.0, "China EQ": 5.1, "Global Bonds": 6.0, "Gold": -1.5, "Cash": 0.1 } },
                { year: "2020", label: "Pandemic shock", returns: { "US EQ": 18.4, "Europe EQ": 5.0, "China EQ": 29.5, "Global Bonds": 9.2, "Gold": 24.6, "Cash": 0.6 } },
                { year: "2017", label: "Growth optimism", returns: { "US EQ": 21.8, "Europe EQ": 25.0, "China EQ": 54.1, "Global Bonds": 7.4, "Gold": 13.7, "Cash": 0.8 } },
                { year: "2022", label: "Inflation and tightening", returns: { "US EQ": -18.1, "Europe EQ": -15.0, "China EQ": -21.8, "Global Bonds": -16.2, "Gold": 0.4, "Cash": 2.1 } },
                { year: "2024", label: "Momentum vs diversification", returns: { "US EQ": 24.2, "Europe EQ": 9.0, "China EQ": 16.4, "Global Bonds": 2.8, "Gold": 27.4, "Cash": 5.1 } },
                { year: "2009", label: "Recovery or trap", returns: { "US EQ": 26.5, "Europe EQ": 32.0, "China EQ": 53.0, "Global Bonds": 5.9, "Gold": 24.3, "Cash": 0.2 } }
            ]
        },
        D: {
            name: "Decision-Making Under Uncertainty",
            subheader: "Set D · Decision-Making Under Uncertainty · 6 rounds · $10,000 start",
            rounds: [
                { year: "2018", label: "Late-cycle uncertainty", returns: { "US EQ": -4.4, "Europe EQ": -14.0, "China EQ": -18.8, "Global Bonds": -1.2, "Gold": -1.6, "Cash": 1.8 } },
                { year: "2012", label: "Stabilisation", returns: { "US EQ": 16.0, "Europe EQ": 19.0, "China EQ": 14.3, "Global Bonds": 4.2, "Gold": 7.1, "Cash": 0.1 } },
                { year: "2021", label: "Reopening and inflation debate", returns: { "US EQ": 28.7, "Europe EQ": 16.0, "China EQ": -21.6, "Global Bonds": -4.7, "Gold": -3.6, "Cash": 0.1 } },
                { year: "2008", label: "Global financial crisis", returns: { "US EQ": -37.0, "Europe EQ": -45.0, "China EQ": -65.4, "Global Bonds": 5.2, "Gold": 5.5, "Cash": 1.4 } },
                { year: "2023", label: "Concentrated recovery", returns: { "US EQ": 26.3, "Europe EQ": 19.0, "China EQ": -11.2, "Global Bonds": 5.7, "Gold": 13.1, "Cash": 5.2 } },
                { year: "2020", label: "Pandemic shock", returns: { "US EQ": 18.4, "Europe EQ": 5.0, "China EQ": 29.5, "Global Bonds": 9.2, "Gold": 24.6, "Cash": 0.6 } }
            ]
        }
    };

    let currentSet = 'A';
    let ROUNDS_DATA = ALL_SETS.A.rounds;
    let currentRound = 0;
    let capital = 10000.0;
    let history = [];
    let allRoundReturns = [];
    let currentMode = 'dollar';
    let isProcessing = false;
    let gameCompleted = false;

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
    const setSubHeader = document.getElementById('setSubHeader');

    // Set buttons
    const setA = document.getElementById('setA');
    const setB = document.getElementById('setB');
    const setC = document.getElementById('setC');
    const setD = document.getElementById('setD');

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

    const TOLERANCE = 0.10;

    // ----- Set Switching -----
    function switchSet(setKey) {
        currentSet = setKey;
        ROUNDS_DATA = ALL_SETS[setKey].rounds;
        setSubHeader.textContent = ALL_SETS[setKey].subheader;
        
        document.querySelectorAll('.set-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-set="${setKey}"]`).classList.add('active');
        
        performReset();
    }

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
        isProcessing = false;
        gameCompleted = false;
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
        
        // HIDE YEAR TAG
        if (yearTag) {
            yearTag.textContent = '';
            yearTag.style.display = 'none';
        }
        
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

    // ----- Quick Actions -----
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
            const equityAssets = ['US EQ', 'Europe EQ', 'China EQ'];
            const equityPct = 70;
            const bondsPct = 20;
            const goldPct = 10;
            const cashPct = 0;
            
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
                    val = 0;
                }
                inputValues[name] = { dollar: val, percent: pct };
            });
        } else if (type === 'defensive') {
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
        
        const assetTypes = {
            "US EQ": "📈 Equity",
            "Europe EQ": "📈 Equity",
            "China EQ": "📈 Equity",
            "Global Bonds": "📊 Bond",
            "Gold": "🏆 Commodity",
            "Cash": "💰 Cash"
        };
        
        if (Object.keys(inputValues).length === 0) {
            assetNames.forEach(name => {
                inputValues[name] = { dollar: 0, percent: 0 };
            });
        }
        
        for (let name of assetNames) {
            const dollarVal = inputValues[name]?.dollar || 0;
            const percentVal = inputValues[name]?.percent || 0;
            const assetType = assetTypes[name] || '🔒 hidden';
            
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
                    <span class="asset-type-badge">${assetType}</span>
                    ${inputFields}
                    <span class="pct-display">${displayPct > 0 ? displayPct.toFixed(1) + '%' : ''}</span>
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
        if (gameCompleted) {
            submitBtn.disabled = true;
            submitBtn.textContent = '🏁 Game Over';
        } else {
            submitBtn.disabled = (errorMsg.length > 0 || sumDollar < 0.01);
        }
    }

    // ----- Submit Allocation -----
    function submitAllocation() {
        if (gameCompleted) {
            globalError.textContent = '🎉 Game already completed! All 6 rounds finished.';
            return;
        }
        
        if (history.length >= ROUNDS_DATA.length) {
            gameCompleted = true;
            submitBtn.disabled = true;
            submitBtn.textContent = '🏁 Game Over';
            globalError.textContent = '🎉 All 6 rounds completed! Check your final capital above.';
            renderHistory();
            refreshUI();
            return;
        }
        
        if (currentRound >= ROUNDS_DATA.length) {
            gameCompleted = true;
            submitBtn.disabled = true;
            submitBtn.textContent = '🏁 Game Over';
            globalError.textContent = '🎉 All 6 rounds completed!';
            renderHistory();
            refreshUI();
            return;
        }
        
        if (isProcessing) return;
        isProcessing = true;
        
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
            isProcessing = false;
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

        // HIDE YEAR - don't display it anywhere
        if (yearTag) {
            yearTag.textContent = '';
            yearTag.style.display = 'none';
        }

        const existingRound = history.find(h => h.round === currentRound + 1);
        if (!existingRound) {
            const roundReturnData = {
                year: "Hidden",
                label: "Hidden",
                returns: { ...returns },
                allocations: { ...allocationMap },
                totalReturn: totalReturn,
                returnPercent: returnPercent,
                newCapital: newCapital
            };
            allRoundReturns.push(roundReturnData);

            history.push({
                round: currentRound + 1,
                year: "Hidden",
                label: "Hidden",
                allocation: { ...allocationMap },
                startCapital: capital,
                returnAmount: totalReturn,
                returnPercent: returnPercent,
                newCapital: newCapital,
                returns: { ...returns }
            });
        }

        resultBlock.style.display = 'block';
        returnAmountDisplay.textContent = (totalReturn >= 0 ? '+' : '') + fmt(totalReturn);
        returnPercentDisplay.textContent = fmt(returnPercent) + '%';
        newCapitalDisplay.textContent = fmt(newCapital);

        capital = newCapital;

        saveAllData();

        const assetNamesClear = getAssetNames();
        assetNamesClear.forEach(name => {
            inputValues[name] = { dollar: 0, percent: 0 };
        });

        if (history.length >= ROUNDS_DATA.length) {
            gameCompleted = true;
            submitBtn.disabled = true;
            submitBtn.textContent = '🏁 Game Over';
            globalError.textContent = '🎉 All 6 rounds completed! Check your final capital above.';
            renderHistory();
            refreshUI();
            isProcessing = false;
            return;
        }

        if (currentRound < ROUNDS_DATA.length - 1) {
            currentRound++;
            updateRoundHeader();
            renderAssets();
            resultBlock.style.display = 'block';
            renderHistory();
            globalError.textContent = '';
        } else {
            if (currentRound === ROUNDS_DATA.length - 1) {
                gameCompleted = true;
                submitBtn.disabled = true;
                submitBtn.textContent = '🏁 Game Over';
                globalError.textContent = '🎉 All 6 rounds completed!';
            }
        }
        refreshUI();
        isProcessing = false;
    }

    function saveAllData() {
        const data = {
            history: history,
            currentCapital: capital,
            allRoundReturns: allRoundReturns,
            currentSet: currentSet
        };
        
        localStorage.setItem('gameHistory', JSON.stringify(history));
        localStorage.setItem('currentCapital', capital.toString());
        localStorage.setItem('allRoundReturns', JSON.stringify(allRoundReturns));
        localStorage.setItem('gameData', JSON.stringify(data));
        localStorage.setItem('currentSet', currentSet);
        
        try {
            fetch('/api/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            }).catch(e => console.log('Backend not available, using localStorage only'));
        } catch(e) {}
    }

    // ----- Update Round Header - NO YEAR -----
    function updateRoundHeader() {
        if (gameCompleted || currentRound >= ROUNDS_DATA.length) {
            roundLabel.textContent = `🏁 Game Over`;
        } else {
            roundLabel.textContent = `Round ${currentRound + 1}`;
        }
        // Always hide the year tag
        if (yearTag) {
            yearTag.textContent = '';
            yearTag.style.display = 'none';
        }
    }

    function renderHistory() {
        if (history.length === 0) {
            historyEntries.innerHTML = `<span style="color:#4d6f8b;">— allocations & results will appear here</span>`;
            return;
        }
        let html = '';
        const displayHistory = history.slice(0, ROUNDS_DATA.length);
        for (let h of displayHistory) {
            const allocStr = Object.entries(h.allocation)
                .filter(([k,v]) => v > 0)
                .map(([k,v]) => `${k}: ${fmt(v)}`)
                .join(' · ');
            html += `
                <div class="entry">
                    <span class="tag">R${h.round}</span>
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
        
        if (gameCompleted) {
            if (confirm('Game is already completed. Would you like to reset and start over?')) {
                performReset();
            }
            return;
        }
        
        submitBtn.disabled = false;
        if (yearTag) {
            yearTag.textContent = '';
            yearTag.style.display = 'none';
        }
        if (currentRound === ROUNDS_DATA.length - 1 && history.length === ROUNDS_DATA.length) {
            submitBtn.disabled = true;
            submitBtn.textContent = '🏁 Game Over';
            gameCompleted = true;
        } else {
            submitBtn.textContent = '✅ Done — reveal returns';
        }
        refreshUI();
    }

    function init() {
        isProcessing = false;
        gameCompleted = false;
        
        if (!assetGrid) {
            console.error('Asset grid not found!');
            return;
        }

        // HIDE YEAR TAG ON LOAD
        if (yearTag) {
            yearTag.textContent = '';
            yearTag.style.display = 'none';
        }

        const savedSet = localStorage.getItem('currentSet');
        if (savedSet && ALL_SETS[savedSet]) {
            currentSet = savedSet;
            ROUNDS_DATA = ALL_SETS[savedSet].rounds;
            setSubHeader.textContent = ALL_SETS[savedSet].subheader;
            document.querySelectorAll('.set-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            document.querySelector(`[data-set="${savedSet}"]`).classList.add('active');
        }

        const savedData = localStorage.getItem('gameData');
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                if (data.history && data.history.length > 0) {
                    let uniqueHistory = [];
                    let seenRounds = new Set();
                    for (let h of data.history) {
                        if (!seenRounds.has(h.round)) {
                            seenRounds.add(h.round);
                            uniqueHistory.push(h);
                        }
                    }
                    history = uniqueHistory;
                    capital = data.currentCapital || 10000.0;
                    
                    let uniqueReturns = [];
                    let seenYears = new Set();
                    for (let r of (data.allRoundReturns || [])) {
                        if (!seenYears.has(r.year)) {
                            seenYears.add(r.year);
                            uniqueReturns.push(r);
                        }
                    }
                    allRoundReturns = uniqueReturns;
                    
                    if (history.length > ROUNDS_DATA.length) {
                        history = history.slice(-ROUNDS_DATA.length);
                        history = history.map((h, i) => ({ ...h, round: i + 1 }));
                    }
                    
                    if (allRoundReturns.length > ROUNDS_DATA.length) {
                        allRoundReturns = allRoundReturns.slice(-ROUNDS_DATA.length);
                    }
                    
                    saveAllData();
                    
                    if (history.length >= ROUNDS_DATA.length) {
                        gameCompleted = true;
                        currentRound = ROUNDS_DATA.length - 1;
                        submitBtn.disabled = true;
                        submitBtn.textContent = '🏁 Game Over';
                        globalError.textContent = '🎉 All 6 rounds completed! Check your final capital above.';
                    } else {
                        currentRound = history.length;
                        submitBtn.disabled = false;
                        submitBtn.textContent = '✅ Done — reveal returns';
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
        
        // Start fresh
        currentRound = 0;
        capital = 10000.0;
        history = [];
        allRoundReturns = [];
        gameCompleted = false;
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
    if (setA) setA.addEventListener('click', () => switchSet('A'));
    if (setB) setB.addEventListener('click', () => switchSet('B'));
    if (setC) setC.addEventListener('click', () => switchSet('C'));
    if (setD) setD.addEventListener('click', () => switchSet('D'));

    if (modeDollar) modeDollar.addEventListener('click', () => setMode('dollar'));
    if (modePercent) modePercent.addEventListener('click', () => setMode('percent'));
    if (modeBoth) modeBoth.addEventListener('click', () => setMode('both'));

    if (equalAlloc) equalAlloc.addEventListener('click', () => applyQuickAction('equal'));
    if (cashOnly) cashOnly.addEventListener('click', () => applyQuickAction('cash'));
    if (equityHeavy) equityHeavy.addEventListener('click', () => applyQuickAction('equity'));
    if (defensive) defensive.addEventListener('click', () => applyQuickAction('defensive'));
    if (clearAll) clearAll.addEventListener('click', () => applyQuickAction('clear'));

    if (submitBtn) submitBtn.addEventListener('click', submitAllocation);
    if (resetBtn) resetBtn.addEventListener('click', resetRound);
    if (resetAllBtn) resetAllBtn.addEventListener('click', resetAllGame);

    document.addEventListener('DOMContentLoaded', init);
})();
