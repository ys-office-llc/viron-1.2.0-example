import throttle from 'mout/function/throttle';
import ObjectAssign from 'object-assign';
import TinyMCE from 'tinymce';
import 'tinymce/plugins/code/plugin';
import 'tinymce/plugins/fullscreen/plugin';
import 'tinymce/plugins/hr/plugin';
import 'tinymce/plugins/image/plugin';
import 'tinymce/plugins/link/plugin';
import 'tinymce/plugins/lists/plugin';
import 'tinymce/plugins/paste/plugin';
import 'tinymce/plugins/searchreplace/plugin';
import 'tinymce/plugins/table/plugin';
import 'tinymce/plugins/textcolor/plugin';

const url = new URL(window.location.href);
const baseConfig = {
  menu: {
    edit: { title: 'Edit', items: 'undo redo | cut copy paste | selectall | searchreplace' },
    insert: { title: 'Insert', items: 'image link | inserttable hr' },
    format: {title: 'Format', items: 'bold italic underline strikethrough superscript subscript | removeformat'},
    tools: {title: 'Tools', items: 'code fullscreen'}
  },
  toolbar: [
    'bold italic underline | forecolor backcolor styleselect formatselect fontselect fontsizeselect | image link unlink',
    'alignleft aligncenter alignright alignjustify alignnone | bullist numlist | outdent indent blockquote'
  ],
  plugins: ['code', 'hr', 'lists', 'link', 'image', 'paste', 'searchreplace', 'fullscreen', 'table', 'textcolor'],
  min_height: 300,
  branding: false,
  relative_urls: false,
  remove_script_host: true,
  document_base_url: `${url.origin}${url.pathname}tinymce`,
  skin: 'lightgray',
  skin_url: 'skins/lightgray',
  theme: 'modern',
  theme_url: 'themes/modern/theme.js',
  body_class: 'Wyswyg__body',
  mobile: {
    theme: 'mobile',
    theme_url: 'themes/mobile/theme.js'
  }
};

export default function() {
  this.editor = null;

  this.on('mount', () => {
    TinyMCE.init(ObjectAssign({}, baseConfig, {
      selector: `.Wyswyg__editor${this._riot_id}`,
      init_instance_callback: editor => {
        this.editor = editor;
        !!this.opts.val && this.editor.setContent(this.opts.val);
        this.editor.on('Change', this.handleEditorChange);
        this.editor.on('focus', this.handleEditorFocus);
        this.editor.on('blur', this.handleEditorBlur);
      }
    }));
  }).on('before-unmount', () => {
    TinyMCE.remove(`.Wyswyg__editor${this._riot_id}`);
    this.editor.off('Change', this.handleEditorChange);
    this.editor.off('focus', this.handleEditorFocus);
    this.editor.off('blur', this.handleEditorBlur);
    // destroy時にエラーが発生する。TinyMCEの対応待ち。
    // @see: https://github.com/tinymce/tinymce/issues/3765
    this.editor.destroy();
    this.editor = null;
  });

  // 発火回数を間引く。
  this.handleEditorChange = throttle(() => {
    if (!this.opts.onchange) {
      return;
    }
    const html = this.editor.getContent();
    this.opts.onchange(html);
  }, 1000);

  this.handleEditorFocus = () => {
    if (!this.opts.onfocus) {
      return;
    }
    this.opts.onfocus();
  };

  this.handleEditorBlur = () => {
    if (!this.opts.onblur) {
      return;
    }
    this.opts.onblur();
  };

  this.handleBlockerTap = e => {
    e.stopPropagation();
  };
}
