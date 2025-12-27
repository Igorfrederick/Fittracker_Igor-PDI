/**
 * Classe base Entity
 * Fornece funcionalidades comuns para todos os modelos
 */
class Entity {
  constructor() {
    this._id = null;
  }

  /**
   * Define o ID da entidade
   * @param {String} id - ID do MongoDB
   */
  setId(id) {
    this._id = id;
    return this;
  }

  /**
   * Obtém o ID da entidade
   */
  getId() {
    return this._id;
  }
}

module.exports = Entity;
