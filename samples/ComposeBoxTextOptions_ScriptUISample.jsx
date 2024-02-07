(function textBoxMethods_Sample_Rough(thisObj) {
    function nameEnumMapper(nameEnumMap) {
        return {
            mapNameEnum: nameEnumMap,
            nameToEnum: function (theName) {
                return this.mapNameEnum[theName];
            },
            enumToName: function (theEnum) {
                for (var keyName in this.mapNameEnum) {
                    if (this.mapNameEnum[keyName] === theEnum) {
                        return keyName;
                    }
                }

                return null;
            },
        };
    }

    var firstBaselineOptions = {
        "Ascent": BoxFirstBaselineAlignment.ASCENT,
        "Cap Height": BoxFirstBaselineAlignment.CAP_HEIGHT,
        "Leading": BoxFirstBaselineAlignment.LEADING,
        "x Height": BoxFirstBaselineAlignment.X_HEIGHT,
        "Em Box Height": BoxFirstBaselineAlignment.EM_BOX,
        "Fixed": BoxFirstBaselineAlignment.MINIMUM_VALUE_ROMAN,
        "Legacy": BoxFirstBaselineAlignment.LEGACY_METRIC,
        // "" : BoxFirstBaselineAlignment.MINUMUM_VALUE_ASIAN,  // No Illustrator equivalent
        // "" : BoxFirstBaselineAlignment.TYPO_ASCENT,          // No Illustrator equivalent
    };

    var firstBaselineOptionsMapper = nameEnumMapper(firstBaselineOptions);

    var autoFitPolicyOptions = {
        "Baseline": BoxAutoFitPolicy.HEIGHT_BASELINE,
        "Cursor": BoxAutoFitPolicy.HEIGHT_CURSOR,
        "Precise Bounds": BoxAutoFitPolicy.HEIGHT_PRECISE_BOUNDS,
        "None": BoxAutoFitPolicy.NONE,
    };

    var autoFitPolicyOptionsMapper = nameEnumMapper(autoFitPolicyOptions);

    var verticalAlignmentOptions = {
        "Top": BoxVerticalAlignment.TOP,
        "Center": BoxVerticalAlignment.CENTER,
        "Bottom": BoxVerticalAlignment.BOTTOM,
        "Justify": BoxVerticalAlignment.JUSTIFY,
    };

    var verticalAlignmentOptionsMapper = nameEnumMapper(verticalAlignmentOptions);

    function buildUI(thisObj) {
        var title = "Box Text Options";

        var win =
            thisObj instanceof Panel
                ? thisObj
                : new Window("palette", title, undefined, {
                    resizeable: true,
                });

        // WIN
        // ======
        win.text = title;
        win.orientation = "column";
        win.alignChildren = ["left", "top"];
        win.spacing = 10;
        win.margins = 16;

        // PANEL_OFFSET
        // ============
        var panel_offset = win.add("panel", undefined, undefined, {
            name: "panel_offset",
        });
        panel_offset.text = "Offset";
        panel_offset.orientation = "column";
        panel_offset.alignChildren = ["left", "top"];
        panel_offset.spacing = 10;
        panel_offset.margins = 10;

        // GROUP_INSETSPACING
        // ==================
        var group_insetspacing = panel_offset.add("group", undefined, {
            name: "group_insetspacing",
        });
        group_insetspacing.orientation = "row";
        group_insetspacing.alignChildren = ["left", "center"];
        group_insetspacing.spacing = 10;
        group_insetspacing.margins = 0;

        var label_insetspacing = group_insetspacing.add(
            "statictext",
            undefined,
            undefined,
            { name: "label_insetspacing" }
        );
        label_insetspacing.text = "Inset Spacing:";

        var num_insetspacing = group_insetspacing.add(
            'edittext {properties: {name: "num_insetspacing"}}'
        );
        num_insetspacing.text = "";
        num_insetspacing.preferredSize.width = 34;

        // GROUP_ALIGNBASELINE
        // ===================
        var group_alignbaseline = panel_offset.add("group", undefined, {
            name: "group_alignbaseline",
        });
        group_alignbaseline.orientation = "row";
        group_alignbaseline.alignChildren = ["left", "center"];
        group_alignbaseline.spacing = 10;
        group_alignbaseline.margins = 0;

        var label_firstbaseline = group_alignbaseline.add(
            "statictext",
            undefined,
            undefined,
            { name: "label_firstbaseline" }
        );
        label_firstbaseline.text = "First Baseline:";

        var dropdown_firstbaseline_array = arrayFromKeys(firstBaselineOptions);
        var dropdown_firstbaseline = group_alignbaseline.add(
            "dropdownlist",
            undefined,
            undefined,
            { name: "dropdown_firstbaseline", items: dropdown_firstbaseline_array }
        );
        dropdown_firstbaseline.selection = null;

        // GROUP1
        // ======
        var group1 = panel_offset.add("group", undefined, { name: "group1" });
        group1.orientation = "row";
        group1.alignChildren = ["left", "center"];
        group1.spacing = 10;
        group1.margins = 0;

        var label_minbaseline = group1.add("statictext", undefined, undefined, {
            name: "label_minbaseline",
        });
        label_minbaseline.text = "Minimum Space:";

        var num_minbaseline = group1.add(
            'edittext {properties: {name: "num_minbaseline"}}'
        );
        num_minbaseline.text = "";
        num_minbaseline.preferredSize.width = 34;

        // PANEL_ALIGNMENT
        // ===============
        var panel_alignment = win.add("panel", undefined, undefined, {
            name: "panel_alignment",
        });
        panel_alignment.text = "Alignment";
        panel_alignment.orientation = "row";
        panel_alignment.alignChildren = ["left", "center"];
        panel_alignment.spacing = 10;
        panel_alignment.margins = 10;

        var label_horizontalalignment = panel_alignment.add(
            "statictext",
            undefined,
            undefined,
            { name: "label_horizontalalignment" }
        );
        label_horizontalalignment.text = "Horizontal:";

        var dropdown_horizontalalignment_array = arrayFromKeys(
            verticalAlignmentOptions
        );
        var dropdown_horizontalalignment = panel_alignment.add(
            "dropdownlist",
            undefined,
            undefined,
            {
                name: "dropdown_horizontalalignment",
                items: dropdown_horizontalalignment_array,
            }
        );
        dropdown_horizontalalignment.selection = null;

        // PANEL_BOXSIZE
        // =============
        var panel_boxsize = win.add("panel", undefined, undefined, {
            name: "panel_boxsize",
        });
        panel_boxsize.text = "Box Size";
        panel_boxsize.orientation = "column";
        panel_boxsize.alignChildren = ["left", "center"];
        panel_boxsize.spacing = 10;
        panel_boxsize.margins = 10;

        var msg_oversettext = panel_boxsize.add(
            "statictext",
            undefined,
            undefined,
            { name: "msg_oversettext" }
        );
        str_selectTextLayerMsg = "Select a Text layer to read values";
        msg_oversettext.text = str_selectTextLayerMsg;
        msg_oversettext.justify = "center";
        msg_oversettext.alignment = ["center", "center"];

        var divider1 = panel_boxsize.add("panel", undefined, undefined, {
            name: "divider1",
        });
        divider1.alignment = "fill";

        var checkbox_autosize = panel_boxsize.add(
            "checkbox",
            undefined,
            undefined,
            { name: "checkbox_autosize" }
        );
        checkbox_autosize.text = "Auto Size";

        checkbox_autosize.onClick = function () {
            label_autofitpolicy.enabled = dropdown_autosize.enabled = this.value;

            dropdown_autosize.selection = getIndexOfArrayItem(
                dropdown_autosize_array,
                autoFitPolicyOptionsMapper.enumToName(BoxAutoFitPolicy.HEIGHT_BASELINE)
            );

            if (layersAreSelected()) {
                var currentBoxValues = getBoxTextOptionsFromFirstSelectedLayer();

                msg_oversettext.text = setOversetTextMessage(this, currentBoxValues.boxOverflow)
            } else {
                msg_oversettext.text = str_selectTextLayerMsg
            }

        };

        // GROUP2
        // ======
        var group2 = panel_boxsize.add("group", undefined, { name: "group2" });
        group2.orientation = "row";
        group2.alignChildren = ["left", "center"];
        group2.spacing = 10;
        group2.margins = 0;

        var label_autofitpolicy = group2.add("statictext", undefined, undefined, {
            name: "label_autofitpolicy",
        });
        label_autofitpolicy.text = "Auto Fit Mode:";
        label_autofitpolicy.enabled = false;

        // Don't show last "None" entry for dropdrop_autosize
        var dropdown_autosize_array = arrayFromKeys(autoFitPolicyOptions).slice(
            0,
            -1
        );
        var dropdown_autosize = group2.add("dropdownlist", undefined, undefined, {
            name: "dropdown_autosize",
            items: dropdown_autosize_array,
        });
        dropdown_autosize.selection = null;
        dropdown_autosize.enabled = false;

        // GROUP_BUTTONS
        // =============
        var group_buttons = win.add("group", undefined, { name: "group_buttons" });
        group_buttons.orientation = "column";
        group_buttons.alignChildren = ["center", "center"];
        group_buttons.spacing = 10;
        group_buttons.margins = 0;
        group_buttons.alignment = ["center", "top"];

        var button_read = group_buttons.add("button", undefined, undefined, {
            name: "button_read",
        });
        button_read.text = "Read from Selected Text Layer";

        button_read.onClick = function () {
            var currentBoxValues = getBoxTextOptionsFromFirstSelectedLayer();

            if (!currentBoxValues) {
                return null;
            }

            num_insetspacing.text = currentBoxValues.boxInsetSpacing;

            dropdown_firstbaseline.selection = getIndexOfArrayItem(
                dropdown_firstbaseline_array,
                firstBaselineOptionsMapper.enumToName(currentBoxValues.boxFirstBaselineAlignment)
            );

            num_minbaseline.text = currentBoxValues.boxFirstBaselineAlignmentMinimum;

            dropdown_horizontalalignment.selection = getIndexOfArrayItem(
                dropdown_horizontalalignment_array,
                verticalAlignmentOptionsMapper.enumToName(currentBoxValues.boxVerticalAlignment)
            );

            checkbox_autosize.value = currentBoxValues.boxAutoFitPolicy !== BoxAutoFitPolicy.NONE;

            if (currentBoxValues.boxAutoFitPolicy !== BoxAutoFitPolicy.NONE) {
                label_autofitpolicy.enabled = dropdown_autosize.enabled = true;

                dropdown_autosize.selection = getIndexOfArrayItem(
                    dropdown_autosize_array,
                    autoFitPolicyOptionsMapper.enumToName(currentBoxValues.boxAutoFitPolicy)
                );
            } else {
                label_autofitpolicy.enabled = dropdown_autosize.enabled = false;
            }

            msg_oversettext.text = setOversetTextMessage(
                checkbox_autosize,
                currentBoxValues.boxOverflow
            );
        };

        var button_apply = group_buttons.add("button", undefined, undefined, {
            name: "button_apply",
        });
        button_apply.text = "Apply to Selected Text Layers";

        button_apply.onClick = function () {
            var newBoxValues = {
                boxVerticalAlignment: verticalAlignmentOptionsMapper.nameToEnum(dropdown_horizontalalignment.selection.text),
                boxFirstBaselineAlignment: firstBaselineOptionsMapper.nameToEnum(dropdown_firstbaseline.selection.text),
                boxFirstBaselineAlignmentMinimum: parseInt(num_minbaseline.text) || 0,
                boxInsetSpacing: parseInt(num_insetspacing.text) || 0,
                boxAutoFitPolicy: BoxAutoFitPolicy.NONE,
            };

            if (checkbox_autosize.value) {
                newBoxValues.boxAutoFitPolicy = autoFitPolicyOptionsMapper.nameToEnum(dropdown_autosize.selection.text);
            }

            if (newBoxValues.boxAutoFitPolicy !== BoxAutoFitPolicy.NONE) {
                label_autofitpolicy.enabled = dropdown_autosize.enabled = true;

                dropdown_autosize.selection = getIndexOfArrayItem(
                    dropdown_autosize_array,
                    autoFitPolicyOptionsMapper.enumToName(currentBoxValues.boxAutoFitPolicy)
                );
            } else {
                label_autofitpolicy.enabled = dropdown_autosize.enabled = false;
            }


            applyBoxTextOptionsToSelectedLayers(newBoxValues);
        };

        win.onResizing = win.onResize = function () {
            this.layout.resize();
        };

        return win;
    }

    // PLACE OTHER FUNCTIONS HERE

    function layersAreSelected() {

        var comp = app.project.activeItem;

        if (!comp || !(comp instanceof CompItem) || !comp.selectedLayers.length) {
            return false;
        }

        return true;
    }

    function getSelectedBoxTextLayers() {

        var onlySelectTextLayersErr = "Please select a Text layer";
        var onlySelectBoxTextLayersErr = "Please deselect any layers that are not Box Text layers";

        if (!layersAreSelected()) {
            alert(onlySelectTextLayersErr);
            return null;
        }

        var layerSelection = app.project.activeItem.selectedLayers;

        var theTextDocument;

        for (var i = 0; i < layerSelection.length; i++) {
            if (!(layerSelection[i] instanceof TextLayer)) {
                alert(onlySelectBoxTextLayersErr);

                return null;
            }

            theTextDocument = layerSelection[i].text.sourceText.value;

            if (!theTextDocument.boxText) {
                alert(onlySelectBoxTextLayersErr);

                return null;
            }
        }

        return layerSelection;
    }

    function getBoxTextOptionsFromFirstSelectedLayer() {
        var layerSelection = getSelectedBoxTextLayers();

        if (!layerSelection) {
            return null;
        }

        if (layerSelection.length > 1) {
            alert("More than one Text layer is selected—grabbing the values from the first one.")
        }

        var firstLayer = layerSelection[0];
        var theTextDocument = firstLayer.text.sourceText.value;

        return {
            boxVerticalAlignment: theTextDocument.boxVerticalAlignment,
            boxFirstBaselineAlignment: theTextDocument.boxFirstBaselineAlignment,
            boxFirstBaselineAlignmentMinimum: theTextDocument.boxFirstBaselineAlignmentMinimum,
            boxInsetSpacing: theTextDocument.boxInsetSpacing,
            boxAutoFitPolicy: theTextDocument.boxAutoFitPolicy,
            boxText: theTextDocument.boxText,
            boxOverflow: theTextDocument.boxOverflow,
        };
    }

    function applyBoxTextOptionsToSelectedLayers(boxValuesObject) {
        var layerSelection = getSelectedBoxTextLayers();

        if (!layerSelection) {
            return null;
        }

        var currentLayer;

        app.beginUndoGroup("Apply Box Text Attributes");

        try {

            for (var i = 0; i < layerSelection.length; ++i) {
                currentLayer = layerSelection[i];

                var theTextDocument = currentLayer.text.sourceText.value;

                theTextDocument.boxVerticalAlignment = boxValuesObject.boxVerticalAlignment;
                theTextDocument.boxFirstBaselineAlignment = boxValuesObject.boxFirstBaselineAlignment;
                theTextDocument.boxFirstBaselineAlignmentMinimum = boxValuesObject.boxFirstBaselineAlignmentMinimum;
                theTextDocument.boxInsetSpacing = boxValuesObject.boxInsetSpacing;
                theTextDocument.boxAutoFitPolicy = boxValuesObject.boxAutoFitPolicy;

                currentLayer.text.sourceText.setValue(theTextDocument);
            }

        } catch (err) {

            alert(err.description);

        } finally {

            app.endUndoGroup();
        }
    }

    function setOversetTextMessage(autoSizeCheckbox, isOversetBool) {
        if (autoSizeCheckbox.value) {
            return "Box size is set from text";
        } else if (isOversetBool) {
            return "Some text is overflowing the box";
        } else {
            return "All text is inside the box";
        }
    }

    // Cheap polyfill for Array.indexOf
    function getIndexOfArrayItem(array, item) {
        var i = 0;

        while (i < array.length) {
            if (array[i] === item) {
                return i;
            }

            i++;
        }

        return -1;
    }

    // Cheap polyfill of Object.keys
    function arrayFromKeys(obj) {
        var arr = [];

        for (key in obj) {
            arr.push(key);
        }

        return arr;
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
