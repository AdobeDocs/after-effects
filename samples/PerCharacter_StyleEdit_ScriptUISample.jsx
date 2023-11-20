(function PerCharacter_StyleEdit_ScriptUISample(thisObj){

    // UTILITIES 

    function getRandomInt(min, max) {

        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }

    function getRandomFloat(min, max) {
        return Math.random() * (max - min) + min;
    }

    function getMinMaxFontBounds(sliderValue, currentValue) {

        var maxValue = (1+sliderValue)*currentValue;
        var minValue = currentValue-(maxValue-currentValue);

        return([minValue,maxValue])
    }

    function getMinMaxColorBounds(sliderValue, currentValue, scale) {


        if (sliderValue === 0) {
            return([currentValue,currentValue])
        }

        var rangeValue = sliderValue*scale;

        var currentHueValue = currentValue*scale;
        var maxValue = Math.min(currentHueValue+rangeValue, scale)/scale;
        var minValue = Math.max(currentHueValue-rangeValue, 0)/scale;
        
        return([minValue, maxValue])

    }

    function checkSelection(currentSelection) {

        if (currentSelection instanceof CompItem) {

            var selectedLayers = currentSelection.selectedLayers;
            var textLayers = [];

            for (var l=0, sel = selectedLayers.length; l < sel; l++) {

                if (selectedLayers[l] instanceof TextLayer) {
                    textLayers.push(selectedLayers[l]);
                }
            }

            if (textLayers.length > 0) {
                return(textLayers);
            } else {
                return null;
            }

        } else {
            return null;
        }

    }

    function findFontFamily(familyName) {

        var allFonts = app.fonts.allFonts;

        for (var f=0, fnt=allFonts.length; f < fnt; f++) {

            if (allFonts[f][0].familyName === familyName) {
                return(allFonts[f]);
            }
        }

        return null;
    }

    function rgbToHsl(color) {

        var r = color[0];
        var g = color[1];
        var b = color[2];

        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;
    
        if (max == min) {
            h = s = 0;
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch(max){
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
    
        return([h, s, l]);
    }

    function hslToRgb(color) {

        var h = color[0];
        var s = color[1];
        var l = color[2];

        var r, g, b;
    
        if (s == 0) {
            r = g = b = l;
        } else {
            function convertHue (p, q, t) {
                if(t < 0) t += 1;
                if(t > 1) t -= 1;
                if(t < 1/6) return p + (q - p) * 6 * t;
                if(t < 1/2) return q;
                if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            }
    
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = convertHue(p, q, h + 1/3);
            g = convertHue(p, q, h);
            b = convertHue(p, q, h - 1/3);
        }
    
        return([r, g, b]);
    }

    function setValueOrKeyframe(targetProperty, newValue) {
        if (targetProperty.isTimeVarying) {
            var curLayer = targetProperty.propertyGroup(targetProperty.propertyDepth);
            var curTime = curLayer.containingComp.time;

            targetProperty.setValueAtTime(curTime, newValue);
        } else {
            targetProperty.setValue(newValue);
        }
    }

    // APPLY_RANDOM

    function applySettings(selection, params) {

        var applyParams = {};
        applyParams.fontRange = [];
        applyParams.minMaxFontSize = null;
        applyParams.changeColors = params.changeColors;
        applyParams.minMaxColorHue = null;
        applyParams.minMaxColorSat = null;
        applyParams.minMaxColorLight = null;

        var curLayer = null;
        var curTextDoc = null;

        // If Font+Style option is selected
        if (params.fontOption === 0) {

            var allFonts = app.fonts.allFonts;

            // Putting all fonts and Styles in an array
            for (var f=0, fnt=allFonts.length; f < fnt; f++) {

                for (var s=0, sty=allFonts[f].length; s < sty; s++) {

                    applyParams.fontRange.push(allFonts[f][s]);
                }
            }
        }

        for (var i=0, j=selection.length; i < j; i++) {

            curLayer = selection[i];
            curTextDoc = curLayer.sourceText.value;

            if (params.fontSize > 0) {
                applyParams.minMaxFontSize = getMinMaxFontBounds(params.fontSize, curTextDoc.fontSize);
            }

            // If Style Only option is selected
            if (params.fontOption === 1) {
                applyParams.fontRange = [];

                var fontFamily = findFontFamily(curTextDoc.fontObject.familyName);

                for (var s=0, sty=fontFamily.length; s < sty; s++){
                    applyParams.fontRange.push(fontFamily[s]);
                }
            }

            // If Color Checkbox is selected
            if (params.changeColors) {

                var currentColor = rgbToHsl(curTextDoc.fillColor);

                var getHueBounds = getMinMaxColorBounds(params.minMaxColorHue, currentColor[0], 360);
                applyParams.minMaxColorHue = [Math.max(getHueBounds[0],0),Math.min(getHueBounds[1], 1)]

                var getSatBounds = getMinMaxColorBounds(params.minMaxColorSat, currentColor[1], 100);
                applyParams.minMaxColorSat = [Math.max(getSatBounds[0],0),Math.min(getSatBounds[1], 1)]

                var getLightBounds = getMinMaxColorBounds(params.minMaxColorLight, currentColor[2], 100);
                applyParams.minMaxColorLight = [Math.max(getLightBounds[0],0),Math.min(getLightBounds[1], 1)]

            }

            if (params.styleType === 1) {
                applyPerParag(curLayer, applyParams);
            } else {
                applyPerCharacter(curLayer, applyParams);
            }
        }
    }

    function applyPerCharacter(textLayer, applyParams) {

        var layerTextDoc = textLayer.sourceText.value;
        var maxFontNum = applyParams.fontRange.length;

        // Looping through each Character to apply
        for (var i=0, j=layerTextDoc.toString().length; i < j; i++) {

            myRange = layerTextDoc.characterRange(i);
            myRange.fontObject = applyParams.fontRange[getRandomInt(0, maxFontNum)];

            // Change font Size
            if (applyParams.minMaxFontSize) {
                myRange.fontSize = getRandomInt(applyParams.minMaxFontSize[0], applyParams.minMaxFontSize[1]);
            }

            // Change color
            if (applyParams.changeColors) {
                myRange.fillColor = hslToRgb([getRandomFloat(applyParams.minMaxColorHue[0],applyParams.minMaxColorHue[1]),getRandomFloat(applyParams.minMaxColorSat[0],applyParams.minMaxColorSat[1]),getRandomFloat(applyParams.minMaxColorLight[0],applyParams.minMaxColorLight[1])]);
            }

        }

        setValueOrKeyframe(textLayer.sourceText, layerTextDoc);

    }

    function applyPerParag(textLayer, applyParams) {

        var layerTextDoc = textLayer.sourceText.value;
        var maxFontNum = applyParams.fontRange.length;

        // Looping through each Paragraph to apply
        for (var i=0, j=layerTextDoc.paragraphCount; i < j; i++) {

            myRange = layerTextDoc.paragraphRange(i);
            myRange.fontObject = applyParams.fontRange[getRandomInt(0, maxFontNum)];

            // Change font Size
            if (applyParams.minMaxFontSize) {
                myRange.fontSize = getRandomInt(applyParams.minMaxFontSize[0], applyParams.minMaxFontSize[1]);
            }

            // Change color
            if (applyParams.changeColors) {
                myRange.fillColor = hslToRgb([getRandomFloat(applyParams.minMaxColorHue[0],applyParams.minMaxColorHue[1]),getRandomFloat(applyParams.minMaxColorSat[0],applyParams.minMaxColorSat[1]),getRandomFloat(applyParams.minMaxColorLight[0],applyParams.minMaxColorLight[1])]);
            }
        }

        setValueOrKeyframe(textLayer.sourceText, layerTextDoc);

    }

    // UI BUILDING

    function buildUI(thisObj) {

        // SCRIPT UI

        // WIN
        // ===
        var dialog = (thisObj instanceof Panel) ? thisObj : new Window("palette", undefined, undefined, {resizeable: true});
            dialog.text = "PerCharacter_StyleEdit_ScriptUISample"; 
            dialog.preferredSize.width = 300; 
            dialog.orientation = "column"; 
            dialog.alignChildren = ["fill","top"]; 
            dialog.spacing = 10; 
            dialog.margins = 16; 

        // PNL_FONT
        // ========
        var pnl_font = dialog.add("panel", undefined, undefined, {name: "pnl_font"}); 
            pnl_font.text = "Font"; 
            pnl_font.orientation = "column"; 
            pnl_font.alignChildren = ["fill","top"]; 
            pnl_font.spacing = 10; 
            pnl_font.margins = 10; 
            pnl_font.alignment = ["fill","top"]; 

        // GRP_FONTOPTION
        // ==============
        var grp_fontOption = pnl_font.add("group", undefined, {name: "grp_fontOption"}); 
            grp_fontOption.orientation = "row"; 
            grp_fontOption.alignChildren = ["left","top"]; 
            grp_fontOption.spacing = 10; 
            grp_fontOption.margins = [5,5,5,0]; 

        var txt_fontOption = grp_fontOption.add("statictext", undefined, undefined, {name: "txt_fontOption"}); 
            txt_fontOption.helpTip = "Select between randomizing the font, or just the Style (based on the selected layer(s) first character)."; 
            txt_fontOption.text = "Variation Type"; 
            txt_fontOption.preferredSize.width = 126;
            txt_fontOption.alignment = ["left","fill"]; 

        var drp_fontOption_array = ["Font and Style","Style Only"]; 
        var drp_fontOption = grp_fontOption.add("dropdownlist", undefined, undefined, {name: "drp_fontOption", items: drp_fontOption_array}); 
            drp_fontOption.selection = 0; 
            drp_fontOption.preferredSize.width = 140; 
            drp_fontOption.alignment = ["left","fill"]; 

        // GRP_FONTSIZE
        // ============
        var grp_fontSize = pnl_font.add("group", undefined, {name: "grp_fontSize"}); 
            grp_fontSize.orientation = "row"; 
            grp_fontSize.alignChildren = ["left","top"]; 
            grp_fontSize.spacing = 10; 
            grp_fontSize.margins = [5,0,5,5]; 
            grp_fontSize.alignment = ["fill","top"]; 

        var txt_fontSize = grp_fontSize.add("statictext", undefined, undefined, {name: "txt_fontSize"}); 
            txt_fontSize.helpTip = "Randomize the font size (from 0% to 100% based on the selected layer(s) first character)."; 
            txt_fontSize.text = "Font Size Variation"; 
            txt_fontSize.preferredSize.width = 127;
            txt_fontSize.alignment = ["left","center"]; 

        var sld_fontSize = grp_fontSize.add("slider", undefined, undefined, undefined, undefined, {name: "sld_fontSize"}); 
            sld_fontSize.minvalue = 0; 
            sld_fontSize.maxvalue = 1; 
            sld_fontSize.value = 0.5; 
            sld_fontSize.preferredSize.width = 140; 
            sld_fontSize.alignment = ["left","center"]; 

        // PNL_COLOR
        // =========
        var pnl_color = dialog.add("panel", undefined, undefined, {name: "pnl_color"}); 
            pnl_color.text = "Color"; 
            pnl_color.orientation = "column"; 
            pnl_color.alignChildren = ["left","top"]; 
            pnl_color.spacing = 10; 
            pnl_color.margins = 10; 

        // GRP_COLOR
        // =========
        var grp_color = pnl_color.add("group", undefined, {name: "grp_color"}); 
            grp_color.orientation = "column"; 
            grp_color.alignChildren = ["left","center"]; 
            grp_color.spacing = 10; 
            grp_color.margins = 5; 

        var chk_color = grp_color.add("checkbox", undefined, undefined, {name: "chk_color"}); 
            chk_color.text = "Randomize Color"; 
            chk_color.value = false;
            chk_color.onClick = function(){
                updateColorGroups();
            };

        // GRP_COLORHUE
        // ============
        var grp_colorHue = grp_color.add("group", undefined, {name: "grp_colorHue"}); 
            grp_colorHue.enabled = chk_color.value; 
            grp_colorHue.orientation = "row"; 
            grp_colorHue.alignChildren = ["left","center"]; 
            grp_colorHue.spacing = 10; 
            grp_colorHue.margins = 0; 
            grp_colorHue.alignment = ["fill","center"]; 

        var txt_colorHue = grp_colorHue.add("statictext", undefined, undefined, {name: "txt_colorHue"}); 
            txt_colorHue.text = "Hue Variation"; 
            txt_colorHue.helpTip = "Randomize the Hue (from 0% to 100% of the Hue range based on the selected layer(s) first character)."; 
            txt_colorHue.preferredSize.width = 127; 
            txt_colorHue.alignment = ["left","center"]; 

        var sld_colorHue = grp_colorHue.add("slider", undefined, undefined, undefined, undefined, {name: "sld_colorHue"}); 
            sld_colorHue.minvalue = 0; 
            sld_colorHue.maxvalue = 1; 
            sld_colorHue.value = 0.5; 
            sld_colorHue.preferredSize.width = 140; 
            sld_colorHue.alignment = ["left","center"]; 

        // GRP_COLORSAT
        // ============
        var grp_colorSat = grp_color.add("group", undefined, {name: "grp_colorSat"}); 
            grp_colorSat.enabled = chk_color.value; 
            grp_colorSat.orientation = "row"; 
            grp_colorSat.alignChildren = ["left","center"]; 
            grp_colorSat.spacing = 10; 
            grp_colorSat.margins = 0; 
            grp_colorSat.alignment = ["fill","center"]; 

        var txt_colorSat = grp_colorSat.add("statictext", undefined, undefined, {name: "txt_colorSat"}); 
            txt_colorSat.text = "Saturation Variation"; 
            txt_colorSat.helpTip = "Randomize the Saturation (from 0% to 100% of the Saturation range based on the selected layer(s) first character)."; 
            txt_colorSat.preferredSize.width = 127; 

        var sld_colorSat = grp_colorSat.add("slider", undefined, undefined, undefined, undefined, {name: "sld_colorSat"}); 
            sld_colorSat.minvalue = 0; 
            sld_colorSat.maxvalue = 1; 
            sld_colorSat.value = 0.5; 
            sld_colorSat.preferredSize.width = 140; 

        // GRP_COLORLIGHT
        // ===============
        var grp_colorLight = grp_color.add("group", undefined, {name: "grp_colorLight"}); 
            grp_colorLight.enabled = chk_color.value; 
            grp_colorLight.orientation = "row"; 
            grp_colorLight.alignChildren = ["left","center"]; 
            grp_colorLight.spacing = 10; 
            grp_colorLight.margins = 0; 
            grp_colorLight.alignment = ["fill","center"]; 

        var txt_colorLight = grp_colorLight.add("statictext", undefined, undefined, {name: "txt_colorLight"}); 
            txt_colorLight.text = "Lightness Variation"; 
            txt_colorLight.helpTip = "Randomize the Lightness (from 0% to 100% of the Lightness range based on the selected layer(s) first character)."; 
            txt_colorLight.preferredSize.width = 127; 

        var sld_colorLight = grp_colorLight.add("slider", undefined, undefined, undefined, undefined, {name: "sld_colorLight"}); 
            sld_colorLight.minvalue = 0; 
            sld_colorLight.maxvalue = 1; 
            sld_colorLight.value = 0.5; 
            sld_colorLight.preferredSize.width = 140; 

        // PNL_APPLY
        // =========
        var pnl_apply = dialog.add("panel", undefined, undefined, {name: "pnl_apply"}); 
            pnl_apply.text = "Apply to"; 
            pnl_apply.orientation = "column"; 
            pnl_apply.alignChildren = ["left","top"]; 
            pnl_apply.spacing = 10; 
            pnl_apply.margins = [10,10,10,10]; 

        // GRP_RADIO
        // =========
        var grp_radio = pnl_apply.add("group", undefined, {name: "grp_radio"}); 
            grp_radio.orientation = "column"; 
            grp_radio.alignChildren = ["left","center"]; 
            grp_radio.spacing = 10; 
            grp_radio.margins = 5; 

        var rdo_parag = grp_radio.add("radiobutton", undefined, undefined, {name: "rdo_parag"}); 
        rdo_parag.text = "Individual Paragraphs"; 

        var rdo_char = grp_radio.add("radiobutton", undefined, undefined, {name: "rdo_char"}); 
            rdo_char.text = "Individual Characters"; 
            rdo_char.value = true; 

        // GRP_RANDOMIZE
        // =============
        var grp_randomize = dialog.add("group", undefined, {name: "grp_randomize"}); 
            grp_randomize.orientation = "row"; 
            grp_randomize.alignChildren = ["center","center"]; 
            grp_randomize.spacing = 10; 
            grp_randomize.margins = 0; 

        var btn_randomize = grp_randomize.add("button", undefined, undefined, {name: "btn_randomize"}); 
            btn_randomize.text = "Apply"; 
            btn_randomize.onClick = function(){ 

                var params = getParams();
                var selection = checkSelection(app.project.activeItem);

                if (!selection) {

                    alert("Please select Text Layers in a composition");

                } else {
                    app.beginUndoGroup("PerCharacter_StyleEdit_ScriptUISample");
                    applySettings(selection, params);
                    app.endUndoGroup();
                }
            };

        function getParams(){

            var params = {};

            params.fontOption = drp_fontOption.selection.index;
            params.fontSize = sld_fontSize.value;
            params.changeColors = chk_color.value;
            params.minMaxColorHue = sld_colorHue.value;
            params.minMaxColorSat = sld_colorSat.value;
            params.minMaxColorLight = sld_colorLight.value;

            if (rdo_parag.value) {
                params.styleType = 1;
            } else {
                params.styleType = 2;
            }

            return(params);
        }

        function updateColorGroups(){
            
            grp_colorHue.enabled = chk_color.value;
            grp_colorSat.enabled = chk_color.value; 
            grp_colorLight.enabled = chk_color.value; 

        }


        return dialog;
    }

  var win = buildUI(thisObj);

  if (win instanceof Window) {
    win.center();
    win.show();
  } else {
    win.layout.layout(true);
    win.layout.resize();
  }

})(this);