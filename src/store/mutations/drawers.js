import reject from 'mout/array/reject';
import exporter from './exporter';

export default exporter('drawers', {
  /**
   * ドローワーを追加します。
   * @param {Object} state
   * @param {String} tagName
   * @param {Object} tagOpts
   * @param {Object} drawerOpts
   * @return {Array}
   */
  add: (state, tagName, tagOpts = {}, drawerOpts = {}) => {
    // 意図的に配列の先頭に追加している。
    // TinyMCEのdom監視が強いため。
    state.drawers.unshift({
      id: `drawer_${Date.now()}`,
      tagName,
      tagOpts,
      drawerOpts
    });
    return ['drawers'];
  },

  /**
   * ドローワーを削除します。
   * @param {Object} state
   * @param {String} drawerID
   * @return {Array}
   */
  remove: (state, drawerID) => {
    state.drawers = reject(state.drawers, drawer => {
      return (drawer.id === drawerID);
    });
    return ['drawers'];
  }
});
