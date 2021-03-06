define(['./libs/clipboard.min','ToneEditor','Utils','State', 'Templates/Components/Component'], function (Clipboard, utils, ToneEditor, State, Component) {

  Component.prototype.toString = function(minify, useRefObjects) {
    var _this = this
    var minify = minify || ToneEditor._options.minify
    var useSettingsObjects = useSettingsObjects || ToneEditor._options.useSettingsObjects

    var flattened = this.toneComponent.get()
    var filtered = {}

    // ONLY INCLUDE PARAMETERS AND SUBPARAMETERS THAT EXIST IN EDITOR
    // I.E. NO ARRAYS
    this.parameters.forEach( function(parameter) {
      filtered[parameter.name] = parameter.parentComponent.toneComponent.get(parameter.name)[parameter.name]
    })

    this.subComponents.forEach( function(subComponent) {
      filtered[subComponent.name] = {}
      subComponent.parameters.forEach( function(parameter) {
        filtered[subComponent.name][parameter.name] = parameter.parentComponent.toneComponent.get(parameter.name)[parameter.name]
      })
    })

    // MINIFY (default: false)
    // Minify/collapse copied text
    if (minify) {
      var result = JSON.stringify(filtered)
    } else {
      var result = JSON.stringify(filtered, null, 2)
    }

    // USE REF OBJECTS (default: false)
    // Make copying and pasting more convenient by returning the settings as an object that you can reference elsewhere in your code.
    if (useSettingsObjects) {
      result = 'var '+this.name+'Settings=\n'+result
    }

    return result
  }

  Tone.Editor.deferUntilDrawn( function() {
    // RETURNS FLATTENED PROPERTIES OF TONECOMPONENT
    new Clipboard( '.tone-editor_container .copy-button', {
      text: function(copyButton) {
        var text = ''

        if (copyButton.classList.contains('copy-all')) { // it's the copy-all button
          ToneEditor.components.forEach( function(component) {
            text+='var '+component.id+'Settings = '+component.toString(true, true)+';\n\n'
          })

        } else { // It's a component copy button
          var id = copyButton.getAttribute('data-component-id')
          var component = ToneEditor.componentsById[id]

          text+='var '+id+'Settings = '+component.toString()+';'
        }

        // ANIMATION
        copyButton.innerHTML = '✔️'
        copyButton.style = '-webkit-animation: copy-button-animation 0.5s forwards; animation: copy-button-animation 0.5s forwards;'

        setTimeout( function() {
          copyButton.innerHTML = '📋'
          copyButton.style = ''
        }, 500)

        return text
      }
    })
  })


  ToneEditor.download = function() {
    var text = ''
    ToneEditor.components.forEach( function(component) {
      text+=component.toString(true, true)+';\n\n'
    })

    var filename = this._options.filename

    utils.downloadTextFile(filename, text)
  }


})
