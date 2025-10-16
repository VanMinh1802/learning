const supabase = require("../core/config.js");

class TodoRepository {
  async getAll() {
    const { data, error } = await supabase.from("todos").select("*");

    if (error) {
      throw error;
    }

    return data;
  }

  async create(todoData) {
    const { data, error } = await supabase
      .from("todos")
      .insert(todoData)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  async getById(id) {
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw error;
    }
    return data;
  }

  async update(id, todoData) {
    const { data, error } = await supabase
      .from("todos")
      .update(todoData)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  }

  async remove(id) {
    const { data, error } = await supabase
      .from("todos")
      .delete()
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  }
}

module.exports = new TodoRepository();
