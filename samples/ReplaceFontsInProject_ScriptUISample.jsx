(function replaceFontsInProject(thisObj) {
  function buildUI(thisObj) {
    var win =
      thisObj instanceof Panel
        ? thisObj
        : new Window("dialog", "Replace Fonts in Project", undefined, {
            resizeable: true,
          });

    // REPLACEFONTSINPROJECT
    // =====================
    win.text = "Replace Fonts in Project";
    win.orientation = "column";
    win.alignChildren = ["fill", "top"];
    win.spacing = 10;
    win.margins = 16;

    // CONTAINSFONTLIST
    // ================
    var containsUsedFontList = win.add("group", undefined, {
      name: "containsusedfontlist",
    });
    containsUsedFontList.preferredSize.width = 390;
    containsUsedFontList.preferredSize.height = 183;
    containsUsedFontList.orientation = "column";
    containsUsedFontList.alignChildren = ["fill", "top"];
    containsUsedFontList.spacing = 10;
    containsUsedFontList.margins = 0;

    var usedFontList_array = [];
    var usedFontListbox = containsUsedFontList.add("listbox", undefined, undefined, {
      name: "usedfontlist",
      items: usedFontList_array,
      multiselect: true,
      numberOfColumns: 3,
      columnWidths: [150, 50, 150],
      columnTitles: ["Font", "Usage", "Replacement Font"],
      showHeaders: true,
    });
    usedFontListbox.preferredSize.height = 200;

    populateUsedFontListBox(usedFontListbox);

    // SELECTFONTGROUP
    // ===============
    var selectfontgroup = win.add("group", undefined, {
      name: "selectfontgroup",
    });
    selectfontgroup.orientation = "column";
    selectfontgroup.alignChildren = ["left", "center"];
    selectfontgroup.spacing = 3;
    selectfontgroup.margins = 0;

    var replacefont_label = selectfontgroup.add(
      "statictext",
      undefined,
      undefined,
      { name: "replacefont_label" }
    );
    replacefont_label.text = "Replacement Font";
    replacefont_label.enabled = false;

    // CONTAINSREPLACEMENTLIST
    // =======================
    var containsreplacementcontrols = selectfontgroup.add("group", undefined, {
      name: "containsreplacementlist",
    });
    containsreplacementcontrols.orientation = "row";
    containsreplacementcontrols.alignChildren = ["center", "bottom"];
    containsreplacementcontrols.spacing = 11;
    containsreplacementcontrols.margins = 0;

    // GROUP1
    // ======
    var containsreplacementlists = containsreplacementcontrols.add("group", undefined, {
      name: "group1",
    });
    containsreplacementlists.orientation = "column";
    containsreplacementlists.alignChildren = ["left", "center"];
    containsreplacementlists.spacing = 5;
    containsreplacementlists.margins = 0;

    containsreplacementcontrols.enabled = false;

    var replaceFamilyList_array = [""];
    var replaceFamilyDropdown = containsreplacementlists.add("dropdownlist", undefined, undefined, {
      name: "replacementlist",
      items: replaceFamilyList_array,
    });
    replaceFamilyDropdown.selection = 0;
    replaceFamilyDropdown.preferredSize.width = 310;

    var replaceStyleList_array = [""];
    var replaceStyleDropdown = containsreplacementlists.add("dropdownlist", undefined, undefined, {
      name: "replacementlist1",
      items: replaceStyleList_array,
    });
    replaceStyleDropdown.selection = 0;
    replaceStyleDropdown.preferredSize.width = 310;

    // CONTAINSREPLACEMENTLIST
    // =======================
    var clearBtn = containsreplacementcontrols.add(
      "button",
      undefined,
      undefined,
      { name: "clear_btn" }
    );
    clearBtn.text = "Clear";

    // CONTAINSCANCELOK
    // ================
    var containsCancelOK = win.add("group", undefined, {
      name: "containscancelok",
    });
    containsCancelOK.orientation = "row";
    containsCancelOK.alignChildren = ["right", "center"];
    containsCancelOK.spacing = 10;
    containsCancelOK.margins = 0;

    if (!(win instanceof Panel)) {
      var cancelBtn = containsCancelOK.add("button", undefined, undefined, {
        name: "cancel_btn",
      });
      cancelBtn.text = "Cancel";
    }

    var okBtn = containsCancelOK.add("button", undefined, undefined, {
      name: "ok_btn",
    });
    okBtn.text = "OK";



    /* CALLBACK FUNCTIONS */

    usedFontListbox.onChange = function () {
      if (this.selection) {
        replacefont_label.enabled = containsreplacementcontrols.enabled= true;

        var selectedItems = this.selection;
        var fontToDisplay = null;
        var currentItem;

        for (var i = 0; i < selectedItems.length; i++) {
          currentItem = selectedItems[i];

          if (i) {
            fontToDisplay = currentItem.replacementFont && fontToDisplay && currentItem.replacementFont.hasSameDict(fontToDisplay) ? fontToDisplay : null;
            
            if (!fontToDisplay) {
              break;
            }
          } else {
            fontToDisplay = currentItem.replacementFont;
          }
        }

        if (fontToDisplay) {
          var foundFamily = replaceFamilyDropdown.find(fontToDisplay.nativeFamilyName);

          if (foundFamily) {
            foundFamily.selected = true;
            replaceStyleDropdown.find(fontToDisplay.nativeStyleName).selected = true;
          } else {
            var allFontFamilies = getUsableFontFamiliesAsStringArray();

            for (var i = 0; i < allFontFamilies.length; i++) {
              replaceFamilyDropdown.add("item", allFontFamilies[i]);
            }

            replaceFamilyDropdown.find(fontToDisplay.nativeFamilyName).selected = true;
            replaceStyleDropdown.find(fontToDisplay.nativeStyleName).selected = true;
          }
        } else {
          clearDropdown(replaceFamilyDropdown);
          clearDropdown(replaceStyleDropdown);
        }
      } else {
        replacefont_label.enabled = containsreplacementcontrols.enabled = false;
      }
    };

    replaceFamilyDropdown.onActivate = function () {
      if (!this.selection || this.items.length === 1) {
        this.removeAll();

        var allFontFamilies = getUsableFontFamiliesAsStringArray();

        for (var i = 0; i < allFontFamilies.length; i++) {
          this.add("item", allFontFamilies[i]);
        }
      }
    };

    replaceFamilyDropdown.onChange = replaceStyleDropdown.onChange = function () {
      if (!this.selection) {
        return null;
      }

      if (this == replaceFamilyDropdown) {
        updateFontStylesList(
          replaceStyleDropdown,
          getFontStylesFromFamily(replaceFamilyDropdown.selection.text)
        );
      }

      if (!replaceFamilyDropdown.selection || !replaceStyleDropdown.selection) {
        return null;
      }

      var replacementFont = app.fonts.getFontsByFamilyNameAndStyleName(
        replaceFamilyDropdown.selection.text,
        replaceStyleDropdown.selection.text,
      )[0];
      
      if (replacementFont) {
        updateListBoxSelectionReplacementFont(
          usedFontListbox,
          replacementFont
        );
      }
    };

    clearBtn.onClick = function () {
      if (usedFontListbox.selection) {
        updateListBoxSelectionReplacementFont(usedFontListbox);
      }

      clearDropdown(replaceFamilyDropdown);
      clearDropdown(replaceStyleDropdown);
    }

    okBtn.onClick = function () {
      doFontReplacement(usedFontListbox);

      if (!(win instanceof Panel)) {
        win.close();
      }
    }

    win.onResizing = win.onResize = function () {
      this.layout.resize();
    };

    return win;
  }

  // PLACE OTHER FUNCTIONS HERE

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
    fontStyleDropDropListCtrl.removeAll();

    if (newFontStyleNamesArray) {
      for (var i = 0; i < newFontStyleNamesArray.length; i++) {
        fontStyleDropDropListCtrl.add("item", newFontStyleNamesArray[i]);
      }

      fontStyleDropDropListCtrl.selection = 0;
    }
  }

  function populateUsedFontListBox(theListBox) {
    var fontsInProject = app.project.usedFonts;

    if (fontsInProject.length) {
      var usedFont, currentItem, fontName;

      for (var i = 0; i < fontsInProject.length; i++) {
        usedFont = fontsInProject[i];
        fontName = usedFont.font.nativeFullName;

        if (usedFont.font.isSubstitute) {
          fontName = "[" + fontName + "]";
        }

        currentItem = theListBox.add("item", fontName);
  
        currentItem.currentFont = usedFont.font;
        currentItem.subItems[0].text = usedFont.usedAt.length;
      }
    }
  }

  function updateListBoxSelectionReplacementFont(theListBox, replacementFont) {
    if (theListBox.selection) {
      var selectionLength = theListBox.selection.length;
      var itemIndices = [];

      for (var i = selectionLength - 1; i > -1; i--) {
        itemIndices.push(theListBox.selection[i].index);
        theListBox.selection[i].selected = false;
      }

      itemIndices.reverse();

      var currentItem, currentIndex, updatedCurrentItem;
      var cacheItem = {
        usedNativeFullName: undefined,
        usage: undefined,
        replacementNativeFullName: undefined,
        usedfontObject: undefined,
        replaceFontObject: undefined,
      };

      for (var i = 0; i < itemIndices.length; i++) {
        currentItem = theListBox.items[itemIndices[i]];
        currentIndex = currentItem.index;
        
        cacheItem.usedNativeFullName = currentItem.text;
        cacheItem.usage = currentItem.subItems[0].text;
        cacheItem.usedfontObject = currentItem.currentFont;
        cacheItem.replacementNativeFullName = currentItem.subItems[1].text;
        cacheItem.replaceFontObject = currentItem.replacementFont;

        theListBox.remove(currentIndex);

        app.beginSuppressDialogs();
        updatedCurrentItem = theListBox.add("item", cacheItem.usedNativeFullName, currentIndex);
        app.endSuppressDialogs(false);

        updatedCurrentItem.subItems[0].text = cacheItem.usage;
        updatedCurrentItem.currentFont = cacheItem.usedfontObject;

        if (replacementFont) {
          updatedCurrentItem.subItems[1].text = replacementFont.nativeFullName;
          updatedCurrentItem.replacementFont = replacementFont;
        } else {
          updatedCurrentItem.replacementFont = null;
          updatedCurrentItem.subItems[1].text = "";
        }

        updatedCurrentItem.selected = true;
      }
    }
  }

  function clearDropdown(theDropdown) {
    theDropdown.selection = null;
  }

  function doFontReplacement(theListBox) {
    var allListBoxItems = theListBox.items;
    var currentItem;

    // The replace action is not yet undoable due to a known bug
    app.beginUndoGroup("Replace Fonts in Project");

    try {
      for (var i = 0; i < allListBoxItems.length; i++) {
        currentItem = allListBoxItems[i];
  
        if (currentItem.replacementFont) {
          app.project.replaceFont(currentItem.currentFont, currentItem.replacementFont);
        }
      }
    } catch (err) {
      alert(err.description);
    } finally {
      app.endUndoGroup();
    }
  }


  /* SHOW UI */

  // No need to show the panel if there are no fonts in the project.
  if (!app.project.usedFonts.length) {
    alert("No replaceable fonts.");
    return null;
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
