


(function(){

    function apply_style(ctrlVals){

        // Putting all calls here
        // get the value from the UI

        // for all text layer(s) to apply on
        var theLayerSelection = app.project.activeItem.selectedLayers;
        var currentLayer;

        for (var i = 0; i < theLayerSelection.length; i++) {
            currentLayer = theLayerSelection[i];

            if (currentLayer instanceof TextLayer) {
                var theTextDocument = currentLayer.text.sourceText.value;

                // Character
                // These were RO, now they are RW
                theTextDocument.fauxBold = ctrlVals.fauxBold;
                theTextDocument.fauxItalic = ctrlVals.fauxItalic;

                // These are newly-accessible attributes
                theTextDocument.noBreak = ctrlVals.noBreak;
                theTextDocument.ligature = ctrlVals.ligature;

                theTextDocument.kerning = ctrlVals.kerning;

                theTextDocument.fontCapsOption = getFontCapsOptionFromCtrlIndex(ctrlVals.capsOption);
                theTextDocument.fontBaselineOption = getFontBaselineOptionFromCtrlIndex(ctrlVals.baselineOption);
                theTextDocument.autoKernType = getAutoKernTypeFromCtrlIndex(ctrlVals.autoKernType);
                theTextDocument.baselineDirection = getBaselineDirectionFromCtrlIndex(ctrlVals.baselineDirection);
                theTextDocument.lineJoinType = getLineJoinTypeFromCtrlIndex(ctrlVals.lineJoinType);
                theTextDocument.digitSet = getDigitSetFromCtrlIndex(ctrlVals.digitSet);

                // Paragraph
                theTextDocument.autoHyphenate = ctrlVals.autoHyphenate; 
                theTextDocument.everyLineComposer = ctrlVals.everyLineComposer;
                theTextDocument.hangingRoman = ctrlVals.hangingRoman;

                theTextDocument.startIndent = ctrlVals.startIndent; 
                theTextDocument.endIndent = ctrlVals.endIndent;
                theTextDocument.firstLineIndent = ctrlVals.firstLineIndent;
                theTextDocument.spaceBefore = ctrlVals.spaceBefore; 
                theTextDocument.spaceAfter = ctrlVals.spaceAfter;

                theTextDocument.justification = getJustificationFromCtrlIndex(ctrlVals.justification);
                theTextDocument.direction = getDirectionFromCtrlIndex(ctrlVals.direction);
                theTextDocument.leadingType = getLeadingTypeFromCtrlIndex(ctrlVals.leadingType);

                currentLayer.text.sourceText.setValue(theTextDocument);
            }
        }
    }

    // GET_CONTROL_VALUES

    function getFontCapsOptionFromCtrlIndex(ctrlIndex) {
        return [
            FontCapsOption.FONT_ALL_CAPS,
            FontCapsOption.FONT_ALL_SMALL_CAPS,
            FontCapsOption.FONT_NORMAL_CAPS,
            FontCapsOption.FONT_SMALL_CAPS
        ][ctrlIndex];
    }

    function getFontBaselineOptionFromCtrlIndex(ctrlIndex) {
        return [
            FontBaselineOption.FONT_FAUXED_SUBSCRIPT,
            FontBaselineOption.FONT_FAUXED_SUPERSCRIPT,
            FontBaselineOption.FONT_NORMAL_BASELINE
        ][ctrlIndex];
    }

    function getAutoKernTypeFromCtrlIndex(ctrlIndex) {
        return [
            AutoKernType.METRIC_KERN,
            AutoKernType.NO_AUTO_KERN,
            AutoKernType.OPTICAL_KERN
        ][ctrlIndex];
    }

    function getBaselineDirectionFromCtrlIndex(ctrlIndex) {
        return [
            BaselineDirection.BASELINE_VERTICAL_CROSS_STREAM,
            BaselineDirection.BASELINE_VERTICAL_ROTATED,
            BaselineDirection.BASELINE_WITH_STREAM
        ][ctrlIndex];
    }

    function getLineJoinTypeFromCtrlIndex(ctrlIndex) {
        return [
            LineJoinType.LINE_JOIN_BEVEL,
            LineJoinType.LINE_JOIN_MITER,
            LineJoinType.LINE_JOIN_ROUND
        ][ctrlIndex];
    }

    function getDigitSetFromCtrlIndex(ctrlIndex) {
        return [
            DigitSet.ARABIC_DIGITS,
            DigitSet.ARABIC_DIGITS_RTL,
            DigitSet.DEFAULT_DIGITS,
            DigitSet.FARSI_DIGITS,
            DigitSet.HINDI_DIGITS,
        ][ctrlIndex];
    }

    function getJustificationFromCtrlIndex(ctrlIndex) {
        return [
            ParagraphJustification.CENTER_JUSTIFY,
            ParagraphJustification.FULL_JUSTIFY_LASTLINE_CENTER,
            ParagraphJustification.FULL_JUSTIFY_LASTLINE_FULL,
            ParagraphJustification.FULL_JUSTIFY_LASTLINE_LEFT,
            ParagraphJustification.FULL_JUSTIFY_LASTLINE_RIGHT,
            ParagraphJustification.LEFT_JUSTIFY,
            ParagraphJustification.MULTIPLE_JUSTIFICATIONS,
            ParagraphJustification.RIGHT_JUSTIFY,
        ][ctrlIndex];
    }

    function getDirectionFromCtrlIndex(ctrlIndex) {
        return [
            ParagraphDirection.DIRECTION_LEFT_TO_RIGHT,
            ParagraphDirection.DIRECTION_RIGHT_TO_LEFT,
        ][ctrlIndex];
    }

    function getLeadingTypeFromCtrlIndex(ctrlIndex) {
        return [
            LeadingType.JAPANESE_LEADING_TYPE,
            LeadingType.ROMAN_LEADING_TYPE,
        ][ctrlIndex];
    }

    function getUsableFontFamiliesAsStringArray() {
        var fontFamilyNameList = [];
        var allTheFonts = app.fonts.allFonts;
        var totalNumFonts = allTheFonts.length;
        var currentFontFamily, currentFont;

        for (var i = 0; i < totalNumFonts; i++) {
            currentFontFamily = allTheFonts[i];

            for (var j = 0; j < currentFontFamily.length; j++) {
                currentFont = currentFontFamily[j];

                if (!currentFont.isSubstitute) {
                    continue;
                }
            }

            fontFamilyNameList.push(currentFontFamily[0].familyName);
        }

        return fontFamilyNameList;
    }

    function getFontStylesFromFamily(familyNameString) {
        var fontStyleNameList = [];
        var allTheFonts = app.fonts.allFonts;
        var totalNumFonts = allTheFonts.length;
        var currentFontFamily, currentFont;

        for (var i = 0; i < totalNumFonts; i++) {
            currentFontFamily = allTheFonts[i];

            if (currentFontFamily[0].familyName === familyNameString) {
                for (var j = 0; j < currentFontFamily.length; j++) {
                    currentFont = currentFontFamily[j];
    
                    if (!currentFont.isSubstitute) {
                        fontStyleNameList.push(currentFont.styleName);
                    }
                }

                return fontStyleNameList;
            }
        }
    }

    function updateFontStylesList(fontStyleDropDropListCtrl, newFontStyleNamesArray) {
        fontStyleDropDropListCtrl.removeAll()

        for (var i = 0; i < newFontStyleNamesArray.length; i++) {
            fontStyleDropDropListCtrl.add("item", newFontStyleNamesArray[i]);
        }
        
        fontStyleDropDropListCtrl.selection = 0;
    }

    function joinArrayOfEnumStrings(arrayOfEnums) {
        var resultArr = [];

        for (var i = 0; i < arrayOfEnums.length; i++) {
            resultArr.push(getEnumAsString(arrayOfEnums[i]));
        }

        return resultArr.join();
    }

    function InspectFont_EditType_ScriptUISample(thisObj){

        // SCRIPT UI

        // WIN
        // ===
        var dialog = new Window("palette", undefined, undefined, {resizeable: true}); 
            dialog.text = "InspectFont EditType ScriptUISample"; 
            dialog.orientation = "row"; 
            dialog.alignChildren = ["center","top"]; 
            dialog.spacing = 10; 
            dialog.margins = 16; 

        // PNL_DETAILS
        // ===========
        var pnl_details = dialog.add("panel", undefined, undefined, {name: "pnl_details"}); 
            pnl_details.text = "Reading and Listing fonts"; 
            pnl_details.orientation = "column"; 
            pnl_details.alignChildren = ["left","top"]; 
            pnl_details.spacing = 10; 
            pnl_details.margins = 10; 
            pnl_details.alignment = ["center","fill"]; 

        // GRP_MAIN
        // ========
        var grp_main = pnl_details.add("group", undefined, {name: "grp_main"}); 
            grp_main.orientation = "column"; 
            grp_main.alignChildren = ["fill","top"]; 
            grp_main.spacing = 10; 
            grp_main.margins = 0; 

        // GRP_ACTIONS
        // ===========
        var grp_actions = grp_main.add("group", undefined, {name: "grp_actions"}); 
            grp_actions.orientation = "column"; 
            grp_actions.alignChildren = ["left","top"]; 
            grp_actions.spacing = 10; 
            grp_actions.margins = [0,6,0,0]; 

        // GRP_FNTLIST
        // ===========
        var grp_fntList = grp_actions.add("group", undefined, {name: "grp_fntList"}); 
            grp_fntList.orientation = "column"; 
            grp_fntList.alignChildren = ["fill","center"]; 
            grp_fntList.spacing = 10; 
            grp_fntList.margins = 0; 
            grp_fntList.alignment = ["left","top"]; 

        var txt_fntList = grp_fntList.add("statictext", undefined, undefined, {name: "txt_fntList"}); 
            txt_fntList.text = "Font List:"; 

        var drp_fntFamilyList_array = getUsableFontFamiliesAsStringArray();
        var drp_fntFamilyList = grp_fntList.add("dropdownlist", undefined, undefined, {name: "drp_fntFamilyList", items: drp_fntFamilyList_array}); 
            drp_fntFamilyList.selection = 0;

        var drp_fntStyleList_array = getFontStylesFromFamily(drp_fntFamilyList.selection.text);
        var drp_fntStyleList = grp_fntList.add("dropdownlist", undefined, undefined, {name: "drp_fntStyleList", items: drp_fntStyleList_array}); 
            drp_fntStyleList.selection = 0;

        // PNL_FONT
        // ========
        var pnl_font = grp_main.add("panel", undefined, undefined, {name: "pnl_font"}); 
            pnl_font.text = "Font Object Details"; 
            pnl_font.orientation = "column"; 
            pnl_font.alignChildren = ["left","top"];
            pnl_font.preferredSize.width = 400; 
            pnl_font.spacing = 0; 
            pnl_font.margins = 10; 

        // GRP_LEFT
        // ========
        var grp_left = pnl_font.add("group", undefined, {name: "grp_left"}); 
            grp_left.orientation = "column"; 
            grp_left.alignChildren = ["left","top"]; 
            grp_left.preferredSize.width = 380;
            grp_left.spacing = 3; 
            grp_left.margins = 0; 

        var txt_postscript = grp_left.add("statictext", undefined, undefined, {name: "txt_postscript"}); 
            txt_postscript.text = "PostScript Name";
            txt_postscript.preferredSize.width = 380; 

        var divider1 = grp_left.add("panel", undefined, undefined, {name: "divider1"}); 
            divider1.alignment = "fill"; 

        var txt_fullName = grp_left.add("statictext", undefined, undefined, {name: "txt_fullName"}); 
            txt_fullName.text = "Full Name"; 
            txt_fullName.preferredSize.width = 380; 

        var txt_nativeName = grp_left.add("statictext", undefined, undefined, {name: "txt_nativeName"}); 
            txt_nativeName.text = "Native Name"; 
            txt_nativeName.preferredSize.width = 380; 

        var divider2 = grp_left.add("panel", undefined, undefined, {name: "divider2"}); 
            divider2.alignment = "fill"; 

        var txt_fullFamily = grp_left.add("statictext", undefined, undefined, {name: "txt_fullFamily"}); 
            txt_fullFamily.text = "Family Name"; 
            txt_fullFamily.preferredSize.width = 380; 

        var txt_nativeFamily = grp_left.add("statictext", undefined, undefined, {name: "txt_nativeFamily"}); 
            txt_nativeFamily.text = "Native Family Name"; 
            txt_nativeFamily.preferredSize.width = 380; 

        var divider3 = grp_left.add("panel", undefined, undefined, {name: "divider3"}); 
            divider3.alignment = "fill"; 

        var txt_fullStyle = grp_left.add("statictext", undefined, undefined, {name: "txt_fullStyle"}); 
            txt_fullStyle.text = "Style Name"; 
            txt_fullStyle.preferredSize.width = 380; 

        var txt_nativeStyle = grp_left.add("statictext", undefined, undefined, {name: "txt_nativeStyle"}); 
            txt_nativeStyle.text = "Native Style Name"; 
            txt_nativeStyle.preferredSize.width = 380; 

            var divider3b = grp_left.add("panel", undefined, undefined, {name: "divider3b"}); 
            divider3b.alignment = "fill"; 

        // GRP_RIGHT
        // =========
        var grp_right = pnl_font.add("group", undefined, {name: "grp_right"}); 
            grp_right.orientation = "column"; 
            grp_right.alignChildren = ["left","top"]; 
            grp_right.preferredSize.width = 380; 
            grp_right.spacing = 3; 
            grp_right.margins = 0; 

        var txt_version = grp_right.add("statictext", undefined, undefined, {name: "txt_version"}); 
            txt_version.text = "Version"; 
            txt_version.preferredSize.width = 380; 

        var divider4 = grp_right.add("panel", undefined, undefined, {name: "divider4"}); 
            divider4.alignment = "fill"; 

        var txt_writingScripts = grp_right.add("statictext", undefined, undefined, {name: "txt_writingScripts"}); 
            txt_writingScripts.text = "Writing Scripts"; 
            txt_writingScripts.preferredSize.width = 380; 

        var txt_type = grp_right.add("statictext", undefined, undefined, {name: "txt_type"}); 
            txt_type.text = "Type"; 
            txt_type.preferredSize.width = 380; 

        var divider5 = grp_right.add("panel", undefined, undefined, {name: "divider5"}); 
            divider5.alignment = "fill"; 

        var txt_subtitute = grp_right.add("statictext", undefined, undefined, {name: "txt_subtitute"}); 
            txt_subtitute.text = "Is Subtitute?"; 
            txt_subtitute.preferredSize.width = 380; 

        var txt_adobeFont = grp_right.add("statictext", undefined, undefined, {name: "txt_adobeFont"}); 
            txt_adobeFont.text = "from Adobe Font?"; 
            txt_adobeFont.preferredSize.width = 380; 

        var divider6 = grp_right.add("panel", undefined, undefined, {name: "divider6"}); 
            divider6.alignment = "fill"; 

        var txt_loc = grp_right.add("statictext", undefined, undefined, {name: "txt_loc"}); 
            txt_loc.text = "Location"; 
            txt_loc.preferredSize.width = 380; 

        // PNL_EDIT
        // ========
        var pnl_edit = dialog.add("panel", undefined, undefined, {name: "pnl_edit"}); 
            pnl_edit.text = "Editing Characters and Paragraphs"; 
            pnl_edit.orientation = "column"; 
            pnl_edit.alignChildren = ["left","top"]; 
            pnl_edit.spacing = 10; 
            pnl_edit.margins = 10; 

        // GROUP1
        // ======
        var group1 = pnl_edit.add("group", undefined, {name: "group1"}); 
            group1.orientation = "row"; 
            group1.alignChildren = ["left","fill"]; 
            group1.spacing = 10; 
            group1.margins = 0; 
            group1.alignment = ["fill","top"]; 

        // PANEL1
        // ======
        var panel1 = group1.add("panel", undefined, undefined, {name: "panel1"}); 
            panel1.text = "Characters"; 
            panel1.orientation = "column"; 
            panel1.alignChildren = ["left","top"]; 
            panel1.spacing = 10; 
            panel1.margins = 10; 
            panel1.alignment = ["left","fill"]; 

        // GROUP2
        // ======
        var group2 = panel1.add("group", undefined, {name: "group2"}); 
            group2.orientation = "row"; 
            group2.alignChildren = ["left","top"]; 
            group2.spacing = 10; 
            group2.margins = 0; 

        // GROUP3
        // ======
        var group3 = group2.add("group", undefined, {name: "group3"}); 
            group3.orientation = "column"; 
            group3.alignChildren = ["left","top"]; 
            group3.spacing = 3; 
            group3.margins = 0; 

        var checkboxFauxBold = group3.add("checkbox", undefined, undefined, {name: "checkbox1"}); 
            checkboxFauxBold.text = "Faux Bold"; 

        var checkboxFauxItalic = group3.add("checkbox", undefined, undefined, {name: "checkbox2"}); 
            checkboxFauxItalic.text = "Faux Italic"; 

        // GROUP4
        // ======
        var group4 = group2.add("group", undefined, {name: "group4"}); 
            group4.orientation = "column"; 
            group4.alignChildren = ["left","top"]; 
            group4.spacing = 3; 
            group4.margins = 0; 

        var checkboxNoBreak = group4.add("checkbox", undefined, undefined, {name: "checkbox3"}); 
            checkboxNoBreak.text = "No Break"; 

        var checkboxLigatures = group4.add("checkbox", undefined, undefined, {name: "checkbox4"}); 
            checkboxLigatures.text = "Ligatures"; 

        // GROUP5
        // ======
        var group5 = panel1.add("group", undefined, {name: "group5"}); 
            group5.orientation = "row"; 
            group5.alignChildren = ["left","center"]; 
            group5.spacing = 10; 
            group5.margins = 0; 

        var statictextKerning = group5.add("statictext", undefined, undefined, {name: "statictext1"}); 
            statictextKerning.text = "Kerning"; 

        var sliderKerning = group5.add("slider", undefined, undefined, undefined, undefined, {name: "slider1"}); 
            sliderKerning.minvalue = 0; 
            sliderKerning.maxvalue = 100; 
            sliderKerning.value = 50; 
            sliderKerning.preferredSize.width = 128; 

        // GROUP6
        // ======
        var group6 = panel1.add("group", undefined, {name: "group6"}); 
            group6.orientation = "row"; 
            group6.alignChildren = ["left","center"]; 
            group6.spacing = 10; 
            group6.margins = 0; 
            group6.alignment = ["fill","top"]; 

        // GROUP7
        // ======
        var group7 = group6.add("group", undefined, {name: "group7"}); 
            group7.orientation = "column"; 
            group7.alignChildren = ["left","top"]; 
            group7.spacing = 10; 
            group7.margins = 0; 
            group7.alignment = ["left","top"]; 

        var statictextCapsOptions = group7.add("statictext", undefined, undefined, {name: "statictext2"}); 
            statictextCapsOptions.text = "Caps Options"; 

        var statictextBaselineOptions = group7.add("statictext", undefined, undefined, {name: "statictext3"}); 
            statictextBaselineOptions.text = "Baseline"; 

        var statictextAutoKern = group7.add("statictext", undefined, undefined, {name: "statictext4"}); 
            statictextAutoKern.text = "Auto kern"; 

        var statictextBaselineDirection = group7.add("statictext", undefined, undefined, {name: "statictext5"}); 
            statictextBaselineDirection.text = "Baseline Direction"; 

        var statictextLineJoinType = group7.add("statictext", undefined, undefined, {name: "statictext6"}); 
            statictextLineJoinType.text = "Line Join Type"; 

        var statictextDigitSet = group7.add("statictext", undefined, undefined, {name: "statictext7"}); 
            statictextDigitSet.text = "Digit Set"; 

        // GROUP8
        // ======
        var group8 = group6.add("group", undefined, {name: "group8"}); 
            group8.orientation = "column"; 
            group8.alignChildren = ["left","top"]; 
            group8.spacing = 2; 
            group8.margins = 0; 
            group8.alignment = ["left","fill"]; 

        var dropdownCapsOption_array = ["All Caps","All Small Caps","Normal Caps", "Small Caps"];
        var dropdownCapsOption = group8.add("dropdownlist", undefined, undefined, {name: "dropdown_CapsOption", items: dropdownCapsOption_array}); 
            dropdownCapsOption.selection = 2; 

        var dropdownBaselineOption_array = ["Subscript","Superscript","Baseline"]; 
        var dropdownBaselineOption = group8.add("dropdownlist", undefined, undefined, {name: "dropdown_BaselineOption", items: dropdownBaselineOption_array}); 
            dropdownBaselineOption.selection = 2; 

        var dropdownAutoKern_array = ["Metric","No Auto","Optical"]; 
        var dropdownAutoKern = group8.add("dropdownlist", undefined, undefined, {name: "dropdown_AutoKern", items: dropdownAutoKern_array}); 
            dropdownAutoKern.selection = 1; 

        var dropdownBaselineDirection_array = ["Vertical Cross Stream","Vertical Rotated","With Stream"]; 
        var dropdownBaselineDirection = group8.add("dropdownlist", undefined, undefined, {name: "dropdown_BaselineDirection", items: dropdownBaselineDirection_array}); 
            dropdownBaselineDirection.selection = 2; 

        var dropdownLineJoinType_array = ["Bevel","Miter","Round"]; 
        var dropdownLineJoinType = group8.add("dropdownlist", undefined, undefined, {name: "dropdown_LineJoinType", items: dropdownLineJoinType_array}); 
            dropdownLineJoinType.selection = 0; 

        var dropdownDigitSet_array = ["Arabic","Arabic RTL","Default","Farsi","Hindi"]; 
        var dropdownDigitSet = group8.add("dropdownlist", undefined, undefined, {name: "dropdown_DigitSet", items: dropdownDigitSet_array}); 
            dropdownDigitSet.selection = 2;

        // PANEL2
        // ======
        var panel2 = group1.add("panel", undefined, undefined, {name: "panel2"}); 
            panel2.text = "Paragraph"; 
            panel2.orientation = "column"; 
            panel2.alignChildren = ["left","top"]; 
            panel2.spacing = 10; 
            panel2.margins = 10; 

        // GROUP9
        // ======
        var group9 = panel2.add("group", undefined, {name: "group9"}); 
            group9.orientation = "row"; 
            group9.alignChildren = ["left","top"]; 
            group9.spacing = 10; 
            group9.margins = 0; 

        // GROUP10
        // =======
        var group10 = group9.add("group", undefined, {name: "group10"}); 
            group10.orientation = "column"; 
            group10.alignChildren = ["left","top"]; 
            group10.spacing = 3; 
            group10.margins = 0; 

        var checkboxAutoHyphenate = group10.add("checkbox", undefined, undefined, {name: "checkbox5"}); 
            checkboxAutoHyphenate.text = "Auto Hyphenate"; 

        var checkboxEverylineComposer = group10.add("checkbox", undefined, undefined, {name: "checkbox6"}); 
            checkboxEverylineComposer.text = "Every Line Composer"; 

        // GROUP11
        // =======
        var group11 = group9.add("group", undefined, {name: "group11"}); 
            group11.orientation = "column"; 
            group11.alignChildren = ["left","top"]; 
            group11.spacing = 3; 
            group11.margins = 0; 

        var checkboxHangingRoman = group11.add("checkbox", undefined, undefined, {name: "checkbox7"}); 
            checkboxHangingRoman.text = "Hanging Roman"; 

        // GROUP12
        // =======
        var group12 = panel2.add("group", undefined, {name: "group12"}); 
            group12.orientation = "row"; 
            group12.alignChildren = ["left","top"]; 
            group12.spacing = 10; 
            group12.margins = 0; 

        // GROUP13
        // =======
        var group13 = group12.add("group", undefined, {name: "group13"}); 
            group13.orientation = "column"; 
            group13.alignChildren = ["left","top"]; 
            group13.spacing = 10; 
            group13.margins = 0; 

        var statictextStartIndent = group13.add("statictext", undefined, undefined, {name: "statictext8"}); 
            statictextStartIndent.text = "Start Indent"; 

        var statictextEndIndent = group13.add("statictext", undefined, undefined, {name: "statictext9"}); 
            statictextEndIndent.text = "End Indent"; 

        var statictextFirstLineIndent = group13.add("statictext", undefined, undefined, {name: "statictext10"}); 
            statictextFirstLineIndent.text = "First Line Indent"; 

        var statictextSpaceBefore = group13.add("statictext", undefined, undefined, {name: "statictext11"}); 
            statictextSpaceBefore.text = "Space Before"; 

        var statictextSpaceAfter = group13.add("statictext", undefined, undefined, {name: "statictext12"}); 
            statictextSpaceAfter.text = "Space After"; 

        // GROUP14
        // =======
        var group14 = group12.add("group", undefined, {name: "group14"}); 
            group14.orientation = "column"; 
            group14.alignChildren = ["left","top"]; 
            group14.spacing = 9; 
            group14.margins = 0; 

        var sliderStartIndent = group14.add("slider", undefined, undefined, undefined, undefined, {name: "slider2"}); 
            sliderStartIndent.minvalue = 0; 
            sliderStartIndent.maxvalue = 100; 
            sliderStartIndent.value = 0; 
            sliderStartIndent.preferredSize.width = 128; 

        var sliderEndIndent = group14.add("slider", undefined, undefined, undefined, undefined, {name: "slider3"}); 
            sliderEndIndent.minvalue = 0; 
            sliderEndIndent.maxvalue = 100; 
            sliderEndIndent.value = 0; 
            sliderEndIndent.preferredSize.width = 128; 

        var sliderFirstLineIndent = group14.add("slider", undefined, undefined, undefined, undefined, {name: "slider4"}); 
            sliderFirstLineIndent.minvalue = 0; 
            sliderFirstLineIndent.maxvalue = 100; 
            sliderFirstLineIndent.value = 0; 
            sliderFirstLineIndent.preferredSize.width = 128; 

        var sliderSpaceBefore = group14.add("slider", undefined, undefined, undefined, undefined, {name: "slider5"}); 
            sliderSpaceBefore.minvalue = 0; 
            sliderSpaceBefore.maxvalue = 100; 
            sliderSpaceBefore.value = 0; 
            sliderSpaceBefore.preferredSize.width = 128; 

        var sliderSpaceAfter = group14.add("slider", undefined, undefined, undefined, undefined, {name: "slider6"}); 
            sliderSpaceAfter.minvalue = 0; 
            sliderSpaceAfter.maxvalue = 100; 
            sliderSpaceAfter.value = 0; 
            sliderSpaceAfter.preferredSize.width = 128; 

        // GROUP15
        // =======
        var group15 = panel2.add("group", undefined, {name: "group15"}); 
            group15.orientation = "row"; 
            group15.alignChildren = ["left","top"]; 
            group15.spacing = 10; 
            group15.margins = 0; 
            group15.alignment = ["fill","top"]; 

        // GROUP16
        // =======
        var group16 = group15.add("group", undefined, {name: "group16"}); 
            group16.orientation = "column"; 
            group16.alignChildren = ["left","top"]; 
            group16.spacing = 10; 
            group16.margins = 0; 
            group16.alignment = ["left","fill"]; 

        var statictextJustification = group16.add("statictext", undefined, undefined, {name: "statictext13"}); 
            statictextJustification.text = "Justification"; 

        var statictextDirection = group16.add("statictext", undefined, undefined, {name: "statictext14"}); 
            statictextDirection.text = "Direction"; 

        var statictextLeadingType = group16.add("statictext", undefined, undefined, {name: "statictext15"}); 
            statictextLeadingType.text = "Leading Type"; 

        // GROUP17
        // =======
        var group17 = group15.add("group", undefined, {name: "group17"}); 
            group17.preferredSize.width = 68; 
            group17.orientation = "row"; 
            group17.alignChildren = ["center","center"]; 
            group17.spacing = 10; 
            group17.margins = 0; 

        // GROUP18
        // =======
        var group18 = group15.add("group", undefined, {name: "group18"}); 
            group18.orientation = "column"; 
            group18.alignChildren = ["right","top"]; 
            group18.spacing = 3; 
            group18.margins = 0; 
            group18.alignment = ["left","fill"]; 

        var dropdownJustification_array = ["Center","Last Line Center","Last Line Full","Last Line Left","Last Line Right","Left Justify","Multiple Justifications","Right Justify"]; 
        var dropdownJustification = group18.add("dropdownlist", undefined, undefined, {name: "dropdown7", items: dropdownJustification_array}); 
            dropdownJustification.selection = 0; 

        var dropdownDirection_array = ["Left to Right","Right to Left"]; 
        var dropdownDirection = group18.add("dropdownlist", undefined, undefined, {name: "dropdown8", items: dropdownDirection_array}); 
            dropdownDirection.selection = 0; 

        var dropdownLeadingType_array = ["Japanese","Roman"]; 
        var dropdownLeadingType = group18.add("dropdownlist", undefined, undefined, {name: "dropdown9", items: dropdownLeadingType_array}); 
            dropdownLeadingType.selection = 1; 

        // PNL_EDIT
        // ========
        var txt_select = pnl_edit.add("statictext", undefined, undefined, {name: "txt_select"}); 
            txt_select.enabled = false; 
            txt_select.text = "Select one or more text layers"; 
            txt_select.alignment = ["center","top"]; 

        var button1 = pnl_edit.add("button", undefined, undefined, {name: "button1"}); 
            button1.text = "Apply"; 
            button1.alignment = ["center","top"]; 
            button1.onClick = function(){ 
                apply_style({
                    fauxBold:           checkboxFauxBold.value,
                    fauxItalic:         checkboxFauxItalic.value,
                    noBreak:            checkboxNoBreak.value,
                    ligature:           checkboxLigatures.value,
                    kerning:            Math.round(sliderKerning.value), // Kerning only accepts integers
                    capsOption:         dropdownCapsOption.selection.index,
                    baselineOption:     dropdownBaselineOption.selection.index,
                    autoKernType:       dropdownAutoKern.selection.index,
                    baselineDirection:  dropdownBaselineDirection.selection.index,
                    lineJoinType:       dropdownLineJoinType.selection.index,
                    digitSet:           dropdownDigitSet.selection.index,
                    autoHyphenate:      checkboxAutoHyphenate.value,
                    hangingRoman:       checkboxHangingRoman.value,
                    everyLineComposer:  checkboxEverylineComposer.value,
                    startIndent:        sliderStartIndent.value,
                    endIndent:          sliderEndIndent.value,
                    firstLineIndent:    sliderFirstLineIndent.value,
                    spaceBefore:        sliderSpaceBefore.value,
                    spaceAfter:         sliderSpaceAfter.value,
                    justification:      dropdownJustification.selection.index,
                    direction:          dropdownDirection.selection.index,
                    leadingType:        dropdownLeadingType.selection.index,
                });

                button1.active = true;
                button1.active = false;
            }


        // UPDATE_CONTROLS

        function updateFontInfo() {
          var newFont = app.fonts.getFontsByFamilyNameAndStyleName(
            drp_fntFamilyList.selection.text,
            drp_fntStyleList.selection.text
          )[0];

          txt_postscript.text =     "PostScript Name: " + newFont.postScriptName;
          txt_fullName.text =       "Full Name: " + newFont.fullName;
          txt_nativeName.text =     "Native Full Name: " + newFont.nativeFullName;
          txt_fullFamily.text =     "Family Name: " + newFont.familyName;
          txt_nativeFamily.text =   "Native Family Name: " + newFont.nativeFamilyName;
          txt_fullStyle.text =      "Style Name: " + newFont.styleName;
          txt_nativeStyle.text =    "Native Style Name: " + newFont.nativeStyleName;
          txt_version.text =        "Version: " + newFont.version;
          txt_writingScripts.text = "Writing Scripts: " + joinArrayOfEnumStrings(newFont.writingScripts);
          txt_type.text =           "Type: " + getEnumAsString(newFont.type).toString();
          txt_subtitute.text =      "Is Substitute?: " + newFont.isSubstitute.toString();
          txt_adobeFont.text =      "From Adobe Fonts?: " + newFont.isFromAdobeFonts.toString();
          txt_loc.text =            "Location: " + newFont.location.toString();
        }

        drp_fntFamilyList.onChange = function() {
            updateFontStylesList(
                drp_fntStyleList,
                getFontStylesFromFamily(drp_fntFamilyList.selection.text)
            );

            updateFontInfo();
        }

        drp_fntStyleList.onChange = function () {
            if (!this.selection) {
                return;
            }

            updateFontInfo();
        }

        if (dialog instanceof Window){
            dialog.center();
            dialog.show();
        }else{
            dialog.layout.layout(true);
        }
    }

    InspectFont_EditType_ScriptUISample(this);

})();