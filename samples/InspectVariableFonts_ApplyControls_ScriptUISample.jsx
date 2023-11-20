(function variableFonts_ApplyControls(thisObj) {
  function buildUI(thisObj) {
    var title = "Apply Variable Fonts with Controls";

    var win =
      thisObj instanceof Panel
        ? thisObj
        : new Window("palette", title, undefined, {
            resizeable: true,
          });

    // DIALOG
    // ======
    win.text = title;
    win.orientation = "column";
    win.alignChildren = ["fill", "top"];
    win.spacing = 10;
    win.margins = 16;

    // GROUP1
    // ======
    var group1 = win.add("group", undefined, { name: "group1" });
    group1.orientation = "row";
    group1.alignChildren = ["left", "center"];
    group1.spacing = 10;
    group1.margins = 0;
    group1.alignment = ["fill", "top"];

    var statictext1 = group1.add("statictext", undefined, undefined, {
      name: "statictext1",
    });
    statictext1.text = "Installed Variable Fonts:";

    var dropdown1_array = ["Please choose a variable font"];
    var dropdown1 = group1.add("dropdownlist", undefined, undefined, {
      name: "dropdown1",
      items: dropdown1_array,
    });
    dropdown1.selection = 0;

    // DIALOG
    // ======
    var divider1 = win.add("panel", undefined, undefined, { name: "divider1" });
    divider1.alignment = "fill";

    // GROUP2
    // ======
    var group2 = win.add("group", undefined, { name: "group2" });
    group2.orientation = "column";
    group2.alignChildren = ["fill", "top"];
    group2.spacing = 10;
    group2.margins = 0;

    // GROUP3
    // ======
    var group3 = group2.add("group", undefined, { name: "group3" });
    group3.orientation = "row";
    group3.alignChildren = ["left", "center"];
    group3.spacing = 10;
    group3.margins = 0;

    var statictext_FullNameLabel = group3.add(
      "statictext",
      undefined,
      undefined,
      { name: "statictext2" }
    );
    statictext_FullNameLabel.text = "Full Name:";

    var statictext_FullName = group3.add(
      "statictext",
      undefined,
      undefined,
      { name: "statictext3" }
    );
    statictext_FullName.text = "---";
    statictext_FullName.preferredSize.width = 150;

    var statictext_FamilyPrefixLabel = group3.add(
      "statictext",
      undefined,
      undefined,
      { name: "statictext2" }
    );
    statictext_FamilyPrefixLabel.text = "Family Prefix:";

    var statictext_FamilyPrefix = group3.add(
      "statictext",
      undefined,
      undefined,
      { name: "statictext3" }
    );
    statictext_FamilyPrefix.text = "---";
    statictext_FamilyPrefix.preferredSize.width = 150;

    // GROUP4
    // ======
    var group4 = group2.add("group", undefined, { name: "group4" });
    group4.orientation = "row";
    group4.alignChildren = ["left", "center"];
    group4.spacing = 10;
    group4.margins = 0;

    var statictext_DesignAxesLabel = group4.add(
      "statictext",
      undefined,
      undefined,
      { name: "statictext4" }
    );
    statictext_DesignAxesLabel.text = "Design Axes:";

    // GROUP2
    // ======
    var listbox1_array = [];
    var listbox1_VariableFontInfo = group2.add(
      "listbox",
      undefined,
      undefined,
      {
        name: "listbox1",
        items: listbox1_array,
        numberOfColumns: 4,
        columnWidths: [80, 80, 80, 80],
        columnTitles: ["Name", "Tag", "Min", "Max"],
        showHeaders: true,
      }
    );
    listbox1_VariableFontInfo.preferredSize.height = 100;

    var divider2 = win.add("panel", undefined, undefined, { name: "divider2" });
    divider2.alignment = "fill";

    // GROUP5
    // ======
    var group5 = win.add("group", undefined, { name: "group5" });
    group5.orientation = "column";
    group5.alignChildren = ["left", "center"];
    group5.spacing = 10;
    group5.margins = 0;

    var statictext6 = group5.add("statictext", undefined, undefined, {
      name: "statictext6",
    });
    statictext6.text = "Select a Text Layer and:";
    statictext6.alignment = ["left", "center"];

    // GROUP6
    // ======
    var group6 = group5.add("group", undefined, { name: "group6" });
    group6.orientation = "row";
    group6.alignment = "fill";
    group6.alignChildren = ["fill", "center"];
    group6.spacing = 10;
    group6.margins = 0;

    var button1 = group6.add("button", undefined, undefined, {
      name: "button1",
    });
    button1.text = "Apply Variable Font";

    var button2 = group6.add("button", undefined, undefined, {
      name: "button2",
    });
    button2.text = "Apply Controls for Axes";

    var button3 = group6.add("button", undefined, undefined, {
      name: "button3",
    });
    button3.text = "Close";

    dropdown1.onActivate = function () {
      if (!this.selection) {
        return null;
      }

      if (dropdown1.selection.text === "Please choose a variable font") {
        this.removeAll();

        var variableFonts = getVariableFontFullNameAsStringArray();

        for (var i = 0; i < variableFonts.length; i++) {
          this.add("item", variableFonts[i]);
        }
      }
    };

    dropdown1.onChange = function () {
      if (!this.selection) {
        return null;
      }

      updateVariableFontInfo(dropdown1, statictext_FullName, statictext_FamilyPrefix, listbox1_VariableFontInfo);
    };

    button1.onClick = button2.onClick = function() {
      if (dropdown1.selection.text !== "Please choose a variable font") {
        var applyTheControls = this.properties.name === "button2";

        applyVariableFontAndControls(dropdown1.selection.text, applyTheControls);
      } else {
        alert("Please select an installed variable font from the dropdown menu.");
      }

      this.active = true;
      this.active = false;
    }

    button3.onClick = function() {
      win.close();
    }

    win.onResizing = win.onResize = function () {
      this.layout.resize();
    };

    return win;
  }

  // PLACE OTHER FUNCTIONS HERE

  function getVariableFontFullNameAsStringArray() {
    var fontFamilyNameList = [];
    var allVariableFonts = app.fonts.fontsWithDefaultDesignAxes;
    var totalVariableFonts = allVariableFonts.length;

    for (var i = 0; i < totalVariableFonts; i++) {
      fontFamilyNameList.push(allVariableFonts[i].fullName);
    }

    return fontFamilyNameList.sort();
  }

  function getVariableFontObjectByFullName(theFullName) {
    var allVariableFonts = app.fonts.fontsWithDefaultDesignAxes;
    var totalNumFonts = allVariableFonts.length;
    var currentVariableFont;

    for (var i = 0; i < totalNumFonts; i++) {
      currentVariableFont = allVariableFonts[i];

      if (currentVariableFont.fullName === theFullName) {
        return currentVariableFont;
      }
    }

    return null;
  }

 function updateVariableFontInfo(fontDropdown, fullNameStaticText, familyPrefixStaticText, fontInfoListBox) {
    var fontObj = getVariableFontObjectByFullName(fontDropdown.selection.text);
  
    fullNameStaticText.text = fontObj.fullName;
    familyPrefixStaticText.text = fontObj.familyPrefix;

    fontInfoListBox.removeAll();

    var axisData = fontObj.designAxesData;
    var currentAxis, currentItem;

    for (var i = 0; i < axisData.length; i++) {
      currentAxis = axisData[i];
      currentItem = fontInfoListBox.add("item", currentAxis.name);

      currentItem.subItems[0].text = currentAxis.tag;
      currentItem.subItems[1].text = currentAxis.min;
      currentItem.subItems[2].text = currentAxis.max;
    }
  }

  // EXPRESSION BUILDER //

  var variFontExpression = {
    exprStrings: [],
    axisTags: [],
    fontPrefix: "",
    addAxis: function (theAxisData, ctrlName) {
      var theTag = theAxisData.tag;
      var theMin = theAxisData.min;
      var theMax = theAxisData.max;

      this.axisTags.push(theTag);

      this.exprStrings.push(
        "const " + theTag + 'Slider = effect("' + ctrlName + '")(1);',
        "const " + theTag + "Min = " + theMin + ";",
        "const " + theTag + "Max = " + theMax + ";",
        "const " + theTag + "Interp = linear(" + theTag + "Slider, 0, 100, " + theTag + "Min, " + theTag + "Max);",
        ""
      );
    },
    build: function () {
      var expressionStr = "";

      expressionStr += this.exprStrings.join("\r\n");

      var customVariableFontName = "\nconst fontName = `" + this.fontPrefix;
      var currentTag;

      for (var i = 0; i < this.axisTags.length; i++) {
        currentTag = this.axisTags[i];

        customVariableFontName += "_${" + currentTag + "Interp}" + currentTag;
      }

      expressionStr += customVariableFontName + "`;";

      expressionStr += "\r\n\r\n";
      expressionStr += "text.sourceText.style.setFont(fontName);";

      return expressionStr;
    },
    reset: function () {
      this.exprStrings = [];
      this.axisTags = [];
      this.familyPrefix = "";
    },
  };

  function getSelectedTextLayers() {
    var comp = app.project.activeItem;

    var onlySelectTextLayersErr = "Please select a Text layer";
    var onlySelectTextLayersErr = "Please deselect any layers that are not Text layers";

    if (!comp || !(comp instanceof CompItem)) {
      alert(onlySelectTextLayersErr);

      return null;
    }

    var layerSelection = comp.selectedLayers;

    if (!layerSelection.length) {
      alert(onlySelectTextLayersErr);

      return null;
    }

    for (var i = 0; i < layerSelection.length; i++) {
      if (!(layerSelection[i] instanceof TextLayer)) {
        alert(onlySelectTextLayersErr);
        
        return null;
      }
    }

    return layerSelection;
  }

  function isExpressionEngineJavaScript() {
    if (app.project.expressionEngine !== "javascript-1.0") {
      alert(
        [
          "Please switch the project to the JavaScript expression engine.",
          "",
          'Set Expressions Engine to "JavaScript" in File > Project Settings... > Expressions.',
        ].join("\r\n")
      );

      return false;
    }

    return true;
  }

  function setFontOnTextLayer(theFontObj, theTextLayer) {
    var sourceTxtValue = theTextLayer.text.sourceText.value;

    sourceTxtValue.fontObject = theFontObj;

    theTextLayer.text.sourceText.setValue(sourceTxtValue);
  }

  function applyVariableFontAndControls(variableFontFamilyName, applyControls) {
    if (applyControls && !isExpressionEngineJavaScript()) {
      return null;
    }

    var currentTextLayer,
        removeExpr,
        usingVariFont,
        sourceTxtProp,
        fontObj,
        axisData;

    var undoStr = applyControls
      ? "Add Variable Font and Animation Controls"
      : "Apply Variable Font";

    app.beginUndoGroup(undoStr);

    try {
      var selectedTextLayers = getSelectedTextLayers();

      if (!selectedTextLayers) {
        return null;
      }

      for (var i = 0; i < selectedTextLayers.length; i++) {
        currentTextLayer = selectedTextLayers[i];

        fontObj = getVariableFontObjectByFullName(variableFontFamilyName);

        setFontOnTextLayer(fontObj, currentTextLayer);

        if (!applyControls && currentTextLayer.text.sourceText.expression.indexOf("setFont") !== -1) {
          removeExpr = confirm([
            "The font for '" + currentTextLayer.name + "' is controlled by an expression.",
            "Do you want to remove the expression so the selected variable font is visible?"
          ].join("\r\n"), true);

          if (removeExpr) {
            currentTextLayer.text.sourceText.expression = "";
          }
        }

        if (!applyControls) {
          continue;
        }

        sourceTxtProp = currentTextLayer.text.sourceText;
        usingVariFont = fontObj.hasDesignAxes;

        if (!usingVariFont) {
          continue;
        }

        axisData = fontObj.designAxesData;

        variFontExpression.reset();
        variFontExpression.fontPrefix = fontObj.familyPrefix;

        var currentAxisData, axisSlider;

        for (var j = 0; j < axisData.length; j++) {
          currentAxisData = axisData[j];

          axisSlider = currentTextLayer.effect.addProperty("ADBE Slider Control");
          sliderName = currentAxisData.name + " " + localize("$$$/AE/Effect/Name/SliderControl=Slider Control");
          axisSlider.name = sliderName;

          variFontExpression.addAxis(currentAxisData, sliderName);
        }

        sourceTxtProp.expression = variFontExpression.build();
      }
    } catch (err) {
      alert(err.description);
    } finally {
      app.endUndoGroup();
    }
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
