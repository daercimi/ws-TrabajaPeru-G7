'use strict'
const fs = require('fs');
const config = require('../GlobalEnv');
const helper = require('sendgrid').mail;
const xl = require('excel4node');

function getDateTime(format = "dd-MM-yyyy", longdate = "") {
    var date = (longdate != "") ? new Date(longdate) : new Date();
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
    var min = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;
    var sec = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    var date_result = format.replace('dd', day);
    date_result = date_result.replace('MM', month);
    date_result = date_result.replace('yyyy', year);
    date_result = date_result.replace('hh', hour);
    date_result = date_result.replace('mm', min);
    date_result = date_result.replace('ss', sec);
    return date_result;
}

function removeDuplicates(originalArray, prop) {
    var newArray = [];
    var lookupObject = {};

    for (var i in originalArray) {
        lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for (i in lookupObject) {
        newArray.push(lookupObject[i]);
    }
    return newArray;
}

function isEmptyObject(obj) {
    return !Object.keys(obj).length;
}

function ObjectResponse(params) {
    var dataResponse = {
        "code": params[0],
        "status": params[1],
        "message": params[2],
        "Response": params[3]
    }
    return dataResponse;
}

function validateLanguage(lang) {
    if (!lang) return false;
    if (lang.trim() === "") return false;
    if (fs.existsSync(`./language/${lang}.json`)) {
        return true
    } else {
        return false
    };
}

function sumDays(date, days) {
    date.setDate(date.getDate() + days);
    return date;
}

function getLanguage(lang) {
    if (validateLanguage(lang)) return lang
    else return "en"
}

function sendMail(to_email, subject, type, content, attachments = []) {
    var from_email = new helper.Email(config.sendgrid_from);
    var to_email = new helper.Email(to_email);
    var subject = subject;
    var content = new helper.Content(type, content);
    var mail = new helper.Mail(from_email, subject, to_email, content);
    attachments.forEach(fileattach => {
        var attachment = new helper.Attachment();
        attachment.setContent(fileattach.file)
        attachment.setType(fileattach.mime)
        attachment.setFilename(fileattach.filename)
        attachment.setDisposition("attachment")

        mail.addAttachment(attachment);
    });

    var sg = require('sendgrid')(config.sendgrid_api_key);
    var request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON(),
    });

    sg.API(request, function(error, response) {
        console.log(response.statusCode);
        console.log(response.body);
        console.log(response.headers);
    });
}

function exportTemplate(path, data) {
    var wb = new xl.Workbook();
    // Add Worksheets to the workbook
    var style = wb.createStyle({
        numberFormat: '$#,##0.00; ($#,##0.00); -',
    });

    var sbcolor = wb.createStyle({
        fill: {
            type: 'pattern',
            patternType: 'solid',
            bgColor: '#FBA730',
            fgColor: '#FBA730'
        }
    });

    var sfont = wb.createStyle({
        font: {
            color: '#000000',
            bold: true,
            size: 10
        }
    });

    var sfont2 = wb.createStyle({
        font: {
            color: '#000000',
            bold: false,
            size: 10
        }
    });

    var sborder = wb.createStyle({
        border: {
            left: {
                style: 'thin',
                color: 'black',
            },
            right: {
                style: 'thin',
                color: 'black',
            },
            top: {
                style: 'thin',
                color: 'black',
            },
            bottom: {
                style: 'thin',
                color: 'black',
            },
            outline: false
        }
    });

    var salignment = wb.createStyle({
        alignment: {
            horizontal: 'center'
        }
    });
    const worksheets = data.worksheets;
    worksheets.forEach(worksheet => {
        let ws = wb.addWorksheet(worksheet.name);
        worksheet.headers = worksheet.headers || [];
        worksheet.validations = worksheet.validations || [];
        worksheet.headers.forEach((header, index_h, array) => {
            // Se establece la cabecera
            ws.cell(1, index_h + 1)
                .string(header.name)
                .style(sbcolor)
                .style(sborder)
                .style(salignment)
                .style(sfont);

            // se llena los datos si esta establecido un origen
            if (header.source) {
                data.sources.forEach(source => {
                    if (source.name == header.source) {
                        // Se llenan los datos con el origen
                        source.data.forEach((element, index, array) => {
                            ws.cell(index + 2, index_h + 1)
                                .string(element.name || element.value2)
                                .style(sborder)
                                .style(sfont2)
                        });
                    }
                });
            }

            ws.column(index_h + 1).setWidth(header.width);
        });

        worksheet.validations.forEach(validation => {
            ws.addDataValidation({
                type: validation.type,
                allowBlank: 1,
                prompt: validation.prompt,
                error: 'Seleccionó una opción no válida',
                showDropDown: true,
                sqref: validation.sqref,
                formulas: validation.formulas,
            });
        });
    });

    let promise = new Promise((resolve, reject) => {
        wb.write(path, (err, stats) => {
            if (err) {
                reject(err)
            } else {
                resolve(fs.readFileSync(path, 'base64'));
                fs.unlinkSync(path);
            }
        });
    })
    return promise;
}

function evalObjectValue(object) {
    let keys = Object.keys(object);
    let aux = false
    keys.forEach(key => {
        if (object[key] !== '') {
            return aux = true
        }
    });

    return aux;
}

function redefineProperty(object, oldKey, newKey) {
    Object.defineProperty(object, newKey, Object.getOwnPropertyDescriptor(object, oldKey));
    delete object[oldKey]
}

function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer.from(bitmap).toString('base64');
}

// function to create file from base64 encoded string
function base64_decode(base64str, file) {
    // create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
    let mime = base64str.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
    if (mime && mime.length) {
        // Delete base64 identificator from String
        base64str = base64str.replace(`data:${mime[1]};base64,`, '');
    }
    var bitmap = new Buffer.from(base64str, 'base64');
    // write buffer to file
    fs.writeFileSync(file, bitmap);
    console.log('******** File created from base64 encoded string ********');
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function validateUrl(url) {
    var re = /^(http|https)\:\/\/[a-z0-9\.-]+\.[a-z]{2,4}/gi;
    return re.test(String(url));
}

function zfill(number, width) {
    var numberOutput = Math.abs(number); /* Valor absoluto del número */
    var length = number.toString().length; /* Largo del número */ 
    var zero = "0"; /* String de cero */  
    
    if (width <= length) {
        if (number < 0) {
             return ("-" + numberOutput.toString()); 
        } else {
             return numberOutput.toString(); 
        }
    } else {
        if (number < 0) {
            return ("-" + (zero.repeat(width - length)) + numberOutput.toString()); 
        } else {
            return ((zero.repeat(width - length)) + numberOutput.toString()); 
        }
    }
}

module.exports = {
    getDateTime,
    removeDuplicates,
    isEmptyObject,
    ObjectResponse,
    validateLanguage,
    getLanguage,
    sumDays,
    sendMail,
    exportTemplate,
    base64_encode,
    base64_decode,
    evalObjectValue,
    redefineProperty,
    validateEmail,
    validateUrl,
    zfill
}