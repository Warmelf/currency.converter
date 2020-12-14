let input1 = document.querySelector('.exchange_input');
let buttons1 = document.querySelectorAll('#currency_list_from .currency_item_button');
let buttons2 = document.querySelectorAll('#currency_list_to .currency_item_button');
let exchangeValueFrom = document.querySelector('#exchangeValueFrom');
let exchangeValueTo = document.querySelector('#exchangeValueTo');
let input2 = document.querySelector('#outputValue');
let select1 = document.querySelector('#selectCurFrom');
let select2 = document.querySelector('#selectCurTo');
const invertButton = document.querySelector('.convert_button');
const warning = document.querySelector('.warning');
let popupWindowWrong = document.querySelector('#popupWindowWrong');
let popupBodyWrong = document.querySelector('#popupBodyWrong');
let closePopupWrong = document.querySelector('.popup_close');
let popupWindowLoading = document.querySelector('#popupWindowLoading');
let popupBodyLoading = document.querySelector('#popupBodyLoading');

let value1 = 1;
let value2 = 1;
let currency1 = 'USD';
let currency2 = 'RUB';
let rates = {};

function timeout(ms, promise) {
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
        reject(new Error("timeout"))
        }, ms)
        promise.then(resolve, reject)
    })
};

function modalLoading() {
    timeout(500, fetch(`https://api.ratesapi.io/api/latest?base=${currency1}&symbols=${currency2}`)).then(function(response) {
    }).catch(function(error) {
        popupWindowLoading.classList.add('open');
        popupBodyLoading.classList.add('open');
    });
}

function popupWindowLoadingClose() {
    popupWindowLoading.classList.remove('open');
    popupBodyLoading.classList.remove('open'); 
}

function popupWindowWrongClose() {
    popupWindowWrong.classList.remove('open');
    popupBodyWrong.classList.remove('open'); 
}

async function getRates() {
    // if (!isResolve) {
    //     popupWindowWrong.classList.add('open');
    //     popupBodyWrong.classList.add('open');

    //     closePopupWrong.addEventListener('click', (e) => {
    //         e.preventDefault();
    //         popupWindowWrongClose();
    //     });
        
    //     popupBodyWrong.addEventListener('click', (e) => {   
    //         let idPopup = e.target.getAttribute('id');   
    //         if (idPopup == 'popupBodyWrong') {
    //             popupWindowWrongClose();             
    //         }       
    //     });
        
    //     document.addEventListener('keyup', (e) => {
    //         if (e.key === "Escape") {
    //             popupWindowWrongClose();
    //         }
    //     });
    // }
    modalLoading();

    rates = {};
    const res = await fetch(`https://api.ratesapi.io/api/latest?base=${currency1}&symbols=${currency2}`);
    const data = await res.json();
    popupWindowLoadingClose();
    rates[currency2] = data.rates[currency2];
    rates[currency1] = 1 / data.rates[currency2];
}

function calculateValue1() {
    value1 = (value2 * rates[currency1]).toFixed(3);
}

function calculateValue2() {
    value2 = (value1 * rates[currency2]).toFixed(3);
}

function log() {
    console.log(value1, value2, currency1, currency2, rates);
}

function getBaseValueFrom(str) {
    str.innerHTML = `1 ${currency1} = ${rates[currency2]} ${currency2}`;
};

function getBaseValueTo(str) {
    str.innerHTML = `1 ${currency2} = ${rates[currency1]} ${currency1}`;
};

function render() {
    input1.value = value1;
    input2.value = value2;
    getBaseValueFrom(exchangeValueFrom);
    getBaseValueTo(exchangeValueTo);
}

function currencyIsEqual() {
    if (currency1 === currency2) {
        warning.innerText = 'Выберите разные валюты для конвертации!';
        return true;
    } else {
        warning.innerText = '';
        return false;
    }
}


getRates().then(() => {
    calculateValue2();
    render();

    select1.addEventListener('change', (e) => {
        const value = e.target.value;
        currency1 = value;
        buttons1.forEach((elem) => {
            elem.classList.remove('currency_selected');
        });
        select1.classList.add('currency_selected');
        if (!currencyIsEqual()) {
            getRates().then(() => {
                calculateValue2();
                render();
            });
        }
    });
    
    select2.addEventListener('change', (e) => {
        const value = e.target.value;
        currency2 = value;
        buttons2.forEach((elem) => {
            elem.classList.remove('currency_selected');
        });
        select2.classList.add('currency_selected');
        if (!currencyIsEqual()) {
            getRates().then(() => {
                calculateValue1();
                render();
            });
        }
    });
    
    buttons1.forEach((el) => {
        el.addEventListener('click', (e) => {
            const value = e.target.innerText;
            currency1 = value;
            buttons1.forEach((elem) => {
                elem.classList.remove('currency_selected');
            });
            select1.classList.remove('currency_selected');
            el.classList.add('currency_selected');
            if (!currencyIsEqual()) {
                getRates().then(() => {
                    calculateValue2();
                    render();
                });
            }
        });
    });
    
    buttons2.forEach((el) => {
        el.addEventListener('click', (e) => {
            const value = e.target.innerText;
            currency2 = value;
            buttons2.forEach((elem) => {
                elem.classList.remove('currency_selected');
            });
            select2.classList.remove('currency_selected');
            el.classList.add('currency_selected');
            if (!currencyIsEqual()) {
                getRates().then(() => {
                    calculateValue1();
                    render();
                });
            }
        });
    });
    
    input1.addEventListener('input', (e) => {
        const value = e.target.value;
        value1 = +value;
        calculateValue2();
        render();
    });
    
    input2.addEventListener('input', (e) => {
        const value = e.target.value;
        value2 = +value;
        calculateValue1();
        render();
    });

    invertButton.addEventListener('click', () => {
        let temp = currency2;
        currency2 = currency1;
        currency1 = temp;

        buttons1.forEach(el => {
            el.classList.remove('currency_selected');
            if (el.innerHTML == currency1) {
                el.classList.add('currency_selected');
            }
        });

        buttons2.forEach(el => {
            el.classList.remove('currency_selected');
            if (el.innerHTML == currency2) {
                el.classList.add('currency_selected');
            }
        });

        select1.classList.remove('currency_selected');
        select2.classList.remove('currency_selected');
        [...select1.children].forEach(el => {
            if (el.innerHTML == currency1) {
                el.parentElement.classList.add('currency_selected');
                el.parentElement.value = currency1;
            }
        });
        [...select2.children].forEach(el => {
            if (el.innerHTML == currency2) {
                el.parentElement.classList.add('currency_selected');
                el.parentElement.value = currency2;
            }
        });

        calculateValue2();
        render();
    });
});












// let option;
// let obj = [];
// var currencyFrom = 'USD';
// var currencyTo = 'RUB';










// getBaseValueFrom(exchangeValueFrom);
// getBaseValueTo(exchangeValueTo);
// currOfSelectFrom(selectCurFrom);
// currOfSelectTo(selectCurTo);

// input.addEventListener('input', () => {
//     getBaseValueFrom(exchangeValueFrom);
//     getBaseValueTo(exchangeValueTo);
//     convert();
//     currOfSelectFrom(selectCurFrom);
//     currOfSelectTo(selectCurTo);
// });

// outputValue.addEventListener('input', () => {
//     let otherCur = currencyTo;
//     currencyTo = currencyFrom;
//     currencyFrom = otherCur;

//     let otherInput = outputValue
//     outputValue = input;
//     input = otherInput;

//     let otherCurList = currListToChildren;
//     currListToChildren = currListFromChildren;
//     currListFromChildren = otherCurList;

//     let otherSelect = selectCurTo;
//     selectCurTo = selectCurFrom;
//     selectCurFrom = otherSelect;

//     getBaseValueFrom(exchangeValueFrom);
//     getBaseValueTo(exchangeValueTo);
//     convert();
//     currOfSelectFrom(selectCurFrom);
//     currOfSelectTo(selectCurTo);
//     console.log('меняю аутпут');
// });

// outputValue.addEventListener('blur', () => { 
//     console.log('нет фокуса');
//     let otherCur2 = currencyTo;
//     currencyTo = currencyFrom;
//     currencyFrom = otherCur2;

//     let otherInput2 = outputValue
//     outputValue = input;
//     input = otherInput2;

//     let otherCurList2 = currListToChildren;
//     currListToChildren = currListFromChildren;
//     currListFromChildren = otherCurList2;

//     let otherSelect2 = selectCurTo;
//     selectCurTo = selectCurFrom;
//     selectCurFrom = otherSelect2;
// });



// currListFromChildren.forEach(el => {
//     el.addEventListener('click', () => {
//         currListFromChildren.forEach(elem => {
//             elem.classList.remove('currency_selected');
//         });
//         selectCurFrom.classList.remove('currency_selected');
//         el.classList.add('currency_selected');
//         currencyFrom = el.innerHTML;
//         getBaseValueFrom(exchangeValueFrom);
//         getBaseValueTo(exchangeValueTo);
//         convert();
//     });
// })

// currListToChildren.forEach(el => {
//     el.addEventListener('click', () => {
//         currListToChildren.forEach(elem => {
//             elem.classList.remove('currency_selected');
//         });
//         selectCurTo.classList.remove('currency_selected');
//         el.classList.add('currency_selected');
//         currencyTo = el.innerHTML;
//         getBaseValueFrom(exchangeValueFrom);
//         getBaseValueTo(exchangeValueTo);
//         convert();
//     });
// })

// function getRates(currFrom, currTo) {
//     modalLoading();
//     if (currencyFrom == currencyTo) {       
//         warning.innerHTML = 'Пожалуйста, выберите разные наименования валют для конвертации.';
//         main.appendChild(warning);
//     }
//     return fetch(`https://api.ratesapi.io/api/latest?base=${currFrom}&symbols=${currTo}`).then(rates => {
//             popupWindowLoading.classList.remove('open');
//             popupBodyLoading.classList.remove('open');
            
//             popupBodyLoading.addEventListener('click', (e) => {   
//                 let idPopup = e.target.getAttribute('id');   
//                 if (idPopup == 'popupBodyLoading') {
//                     popupWindowLoading.classList.remove('open');
//                     popupBodyLoading.classList.remove('open');              
//                 }       
//             });

//             document.addEventListener('keyup', (e) => {
//                 if (e.key === "Escape") {
//                     popupWindowLoading.classList.remove('open');
//                     popupBodyLoading.classList.remove('open');
//                 }
//             });

//             return rates.json()
//         })
//         .catch((err) => {
//             console.log(err);

//             popupWindowWrong.classList.add('open');
//             popupBodyWrong.classList.add('open');

//             closePopupWrong.addEventListener('click', (e) => {
//                 e.preventDefault();
//                 popupWindowWrong.classList.remove('open');
//                 popupBodyWrong.classList.remove('open');
//             });
            
//             popupBodyWrong.addEventListener('click', (e) => {   
//                 let idPopup = e.target.getAttribute('id');   
//                 if (idPopup == 'popupBodyWrong') {
//                     popupWindowWrong.classList.remove('open');
//                     popupBodyWrong.classList.remove('open');              
//                 }       
//             });
            
//             document.addEventListener('keyup', (e) => {
//                 if (e.key === "Escape") {
//                     popupWindowWrong.classList.remove('open');
//                     popupBodyWrong.classList.remove('open');
//                 }
//             });
//         })
// };

// function convert() {
//     warning.remove();
//     getRates(currencyFrom, currencyTo).then((res) => {
//         let curVal = res.rates[currencyTo];
//         let amount = Number(input.value);
//         outputValue.value = amount * curVal;
//         return outputValue.value;
//     })
// };


// function timeout(ms, promise) {
//     return new Promise(function(resolve, reject) {
//         setTimeout(function() {
//         reject(new Error("timeout"))
//         }, ms)
//         promise.then(resolve, reject)
//     })
// };

// function modalLoading() {
//     timeout(500, fetch(`https://api.ratesapi.io/api/latest?base=${currencyFrom}&symbols=${currencyTo}`)).then(function(response) {
//     }).catch(function(error) {
//         popupWindowLoading.classList.add('open');
//         popupBodyLoading.classList.add('open');
//     });
// };

// function getBaseValueFrom(str) {
//     getRates(currencyFrom, currencyTo).then((res) => {
//         str.innerHTML = `1 ${currencyFrom} = ${res.rates[currencyTo]} ${currencyTo}`;
//     });
// };

// function getBaseValueTo(str) {
//     getRates(currencyTo, currencyFrom).then((res) => {
//         str.innerHTML = `1 ${currencyTo} = ${res.rates[currencyFrom]} ${currencyFrom}`;
//     });
// };


// function currOfSelectFrom(select) {
//     select.addEventListener('change', (event) => {
//         currencyFrom = event.target.value;
//         currListFromChildren.forEach(el => {  
//             el.classList.remove('currency_selected');
//         });
//         event.target.classList.add('currency_selected');
//         getBaseValueFrom(exchangeValueFrom);
//         getBaseValueTo(exchangeValueTo);
//         convert();
//     });
// };

// function currOfSelectTo(select) {
//     select.addEventListener('change', (event) => {
//         currencyTo = event.target.value;
//         currListToChildren.forEach(el => {  
//             el.classList.remove('currency_selected');
//         });
//         event.target.classList.add('currency_selected');
//         getBaseValueFrom(exchangeValueFrom);
//         getBaseValueTo(exchangeValueTo);
//         convert();
//     });
// };


// invertButton.addEventListener('click', () => {
//     let tempCur = currencyFrom;
//     currencyFrom = currencyTo;
//     currencyTo = tempCur;
//     convert();
//     getBaseValueFrom(exchangeValueFrom);
//     getBaseValueTo(exchangeValueTo);
//     currListFromChildren.forEach(el => {
//         el.classList.remove('currency_selected');
//         if (el.innerHTML == currencyFrom) {
//             el.classList.add('currency_selected');
//         }
//     });
//     selectCurFrom.classList.remove('currency_selected');
//     [...selectCurFrom.children].forEach(el => {
//         if (el.innerHTML == currencyFrom) {
//             el.parentElement.classList.add('currency_selected');
//             el.parentElement.value = currencyFrom;
//         }
//     })
//     currListToChildren.forEach(el => {
//         el.classList.remove('currency_selected');
//         if (el.innerHTML == currencyTo) {
//             el.classList.add('currency_selected');
//         }
//     });
//     selectCurTo.classList.remove('currency_selected');
//     [...selectCurTo.children].forEach(el => {
//         if (el.innerHTML == currencyTo) {
//             el.parentElement.classList.add('currency_selected');
//             el.parentElement.value = currencyTo;
//         }
//     })
// });


const getInformation = async () => {
    const select = document.querySelectorAll('.currency_select');

    const res = await fetch('https://api.ratesapi.io/api/latest');
    const data = await res.json();

    obj = data.rates;
    let keysOfObj = Object.keys(obj);
    let arrOfUsedValue = ['RUB', 'USD', 'EUR', 'GBP'];
    keysOfObj = keysOfObj.filter(item => !arrOfUsedValue.includes(item));
    keysOfObj.forEach(el => {
        select.forEach(elem => {
            option = document.createElement('option');
            option.innerHTML = el;
            elem.appendChild(option);
            option.setAttribute('value', el);
        });                   
    });
    // currOfSelectFrom(selectCurFrom);
    // currOfSelectTo(selectCurTo);
    // getBaseValueFrom(exchangeValueFrom);
    // getBaseValueTo(exchangeValueTo);        
    // convert();       
};

getInformation();