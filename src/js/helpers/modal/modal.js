/**
 * Modal.js
 * @author Joao Teixeira
 * @version 1.0
 * Copyright (c) Joao Teixeira
 * https://github.com/jpntex
 */
export const Modal = (function () {
  /**
   *
   */
  // eslint-disable-next-line no-shadow
  function Modal(type, options) {

    const defaults = {
      title: 'Notification', // Modal title
      message: '', // Modal message
      autoOpen: true, // Show modal when declared
      closeOnEscape: true, // Close when escape key pressed
      closeOnBlur: true, // Close when overlay is clicked
      animated: true, // Animate modal

      // Button options
      buttonLbl: 'Confirm', // Main button label
      buttonClass: '', // Main button class
      cancelLbl: 'Cancel', // Cancel button label

      // Callbacks
      onConfirm: () => {
      }, // Callback on confirm
      onCancel: () => {
      }, // Callback on cancel
      onClose: () => {
      }, // Callback on close
    };

    this.type = type;
    this.options = extend(defaults, options);

    this.init();
  }

  // Modal templates
  const templates = {
    modal: '<div class="modal-box">' +
      '<div class="modal-title">[[title]]<div class="close-modal" data-action="close">&times;</div></div>' +
      '<div class="modal-message">[[message]]</div>' +
      '<div class="modal-buttons">[[buttons]]</div>' +
      '</div>',
    btn: '<div class="modal-btn" data-action="close">[[label]]</div>',
    btnAlert: '<div class="modal-btn btn-alert" data-action="close">[[label]]</div>',
    btnConfirm: '<div class="modal-btn btn-confirm [[classes]]" data-action="confirm">[[label]]</div>',
  };

  // Generates the modal html from the templates given the modal's type and options
  /**
   *
   */
  // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
  function buildModal(type, options) {
    const modal = document.createElement('div');
    modal.classList.add('modal');

    if (options.closeOnBlur) modal.setAttribute('data-action', 'close');

    let modalTmplt = templates.modal;

    // Set modal animations
    if (options.animated) {
      modal.classList.add('fadeIn');
    }

    modalTmplt = modalTmplt.replace('[[title]]', options.title);
    modalTmplt = modalTmplt.replace('[[message]]', options.message);

    let buttons = null;

    // Add buttons based on modal type
    switch (type) {
    case 'confirm':
      buttons = templates.btn.replace('[[label]]', options.cancelLbl);
      buttons += templates.btnConfirm.replace('[[label]]', options.buttonLbl).replace('[[classes]]', options.buttonClass);
      modalTmplt = modalTmplt.replace('[[buttons]]', buttons);
      break;
    case 'alert':
      buttons = templates.btnAlert.replace('[[label]]', options.buttonLbl);
      modalTmplt = modalTmplt.replace('[[buttons]]', buttons);
      break;
    default:
      break;
    }

    modal.innerHTML = modalTmplt;
    return modal;
  }


  // Handle modal events
  Modal.prototype.handleEvent = function (event) {
    const dataAction = event.target.getAttribute('data-action');

    // Animation ended callback
    if (event.type === 'animationend') {
      return this.onAnimationEnd(event);
    }

    // Check if 'Esc' key was pressed and close modal if set
    if (this.options.closeOnEscape) {
      if (event.keyCode === 27) {
        this.options.onCancel();
        return this.close();
      }
    }

    if (dataAction === 'close') {
      this.options.onCancel();
      return this.close();
    }

    if (dataAction === 'confirm') {
      this.options.onConfirm();
      return this.close();
    }
  };

  // Animation end event handler
  Modal.prototype.onAnimationEnd = function (event) {
    this.modal.removeEventListener('animationend', this);
    document.body.removeChild(this.modal);
    this.options.onClose();
    return this;
  };

  // Initialize modal creation
  Modal.prototype.init = function () {
    this.modal = buildModal(this.type, this.options);
    if (this.options.autoOpen) this.open();
  };

  // Open modal
  Modal.prototype.open = function () {
    // Reset to fadeIn animation on open
    if (this.options.animated) {
      this.modal.classList.add('modal', 'fadeIn');
    }

    // Append modal to the body
    document.body.appendChild(this.modal);

    // Attach events listeners
    this.modal.addEventListener('click', this);
    document.onkeyup = this.handleEvent.bind(this);

    return this;
  };

  // Close modal
  Modal.prototype.close = function () {
    // Clean events listeners
    this.modal.removeEventListener('click', this);
    document.onkeyup = null;

    if (this.options.animated) {
      this.modal.addEventListener('animationend', this);
      this.modal.classList.add('modal fadeOut');
    } else {
      document.body.removeChild(this.modal);
      this.options.onClose();
    }

    return this;
  };

  // Helper functions
  /**
   *
   */
  function extend(obj1, obj2) {
    for (const key in obj2)
      if (obj2.hasOwnProperty(key))
        obj1[key] = obj2[key];
    return obj1;
  }

  /**
   *
   */
  function isFunction(fn) {
    return typeof fn === 'function';
  }

  // Modal interfaces
  return {
    confirm: function (options, onConfirm, onCancel, onClose) {
      options = (typeof options === 'string') ? {
        message: options,
      } : options;

      if (isFunction(onClose)) options.onClose = onClose;
      if (isFunction(onCancel)) options.onCancel = onCancel;
      if (isFunction(onConfirm)) options.onConfirm = onConfirm;

      return new Modal('confirm', options);
    },
    alert: function (options, onClose) {
      options = (typeof options === 'string') ? {
        message: options,
      } : options;

      if (isFunction(onClose)) options.onClose = onClose;

      return new Modal('alert', options);
    },
  };
})();