import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'bfpet.db';

export class Database {
  private static instance: Database;
  private db: SQLite.SQLiteDatabase | null = null;

  private constructor() {}

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  async initialize(): Promise<void> {
    try {
      this.db = await SQLite.openDatabaseAsync(DATABASE_NAME);
      console.log('Database initialized successfully');
      
      // Verificar se banco está corrompido e fazer reset se necessário
      await this.validateAndFixDatabase();
      
      await this.createTables();
      await this.seedInitialData();
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  private async validateAndFixDatabase(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      // Tentar contar usuários - se falhar, banco está corrompido
      await this.db.getFirstAsync<any>('SELECT COUNT(*) as count FROM users');
      
      // ✅ Tabela existe, agora verificar colunas faltantes
      await this.addMissingColumns();
    } catch (error: any) {
      console.warn('⚠️ Banco corrompido detectado, recriando...');
      
      try {
        // Dropar todas as tabelas
        const tables = ['shares', 'comments', 'likes', 'posts', 'current_user', 'users'];
        for (const table of tables) {
          try {
            await this.db.execAsync(`DROP TABLE IF EXISTS ${table};`);
            console.log(`🗑️ Tabela ${table} deletada`);
          } catch (err) {
            // Silenciosamente ignora
          }
        }
        console.log('✅ Banco resetado com sucesso');
      } catch (err) {
        console.warn('⚠️ Erro ao resetar banco:', err);
      }
    }
  }

  private async addMissingColumns(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const columnsToAdd = [
      { table: 'users', column: 'avatar_url', definition: 'TEXT' },
      { table: 'users', column: 'bio', definition: 'TEXT' },
      { table: 'users', column: 'created_at', definition: 'DATETIME DEFAULT CURRENT_TIMESTAMP' },
    ];

    for (const { table, column, definition } of columnsToAdd) {
      try {
        // Tentar adicionar coluna
        await this.db.execAsync(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition};`);
        console.log(`✅ Coluna ${column} adicionada à tabela ${table}`);
      } catch (error: any) {
        // Se já existe, tudo bem
        if (error.message.includes('duplicate column') || error.message.includes('already exists')) {
          console.log(`✅ Coluna ${column} já existe em ${table}`);
        } else {
          console.warn(`⚠️ Erro ao adicionar ${column}:`, error.message);
        }
      }
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const tables = [
      `
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          name TEXT NOT NULL,
          avatar_url TEXT,
          bio TEXT,
          created_at DATETIME NOT NULL
        );
      `,
      `
        CREATE TABLE IF NOT EXISTS posts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          type TEXT NOT NULL CHECK(type IN ('adoption', 'found', 'lost')),
          image_url TEXT NOT NULL,
          latitude REAL NOT NULL,
          longitude REAL NOT NULL,
          location_name TEXT NOT NULL,
          likes_count INTEGER DEFAULT 0,
          comments_count INTEGER DEFAULT 0,
          shares_count INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
        );
      `,
      `
        CREATE TABLE IF NOT EXISTS likes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          post_id INTEGER NOT NULL,
          user_id INTEGER NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(post_id, user_id),
          FOREIGN KEY (post_id) REFERENCES posts(id),
          FOREIGN KEY (user_id) REFERENCES users(id)
        );
      `,
      `
        CREATE TABLE IF NOT EXISTS comments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          post_id INTEGER NOT NULL,
          user_id INTEGER NOT NULL,
          text TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (post_id) REFERENCES posts(id),
          FOREIGN KEY (user_id) REFERENCES users(id)
        );
      `,
      `
        CREATE TABLE IF NOT EXISTS shares (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          post_id INTEGER NOT NULL,
          user_id INTEGER NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (post_id) REFERENCES posts(id),
          FOREIGN KEY (user_id) REFERENCES users(id)
        );
      `,
      `
        CREATE TABLE IF NOT EXISTS current_user (
          id INTEGER PRIMARY KEY CHECK (id = 1),
          user_id INTEGER,
          token TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
        );
      `,
    ];

    for (const table of tables) {
      try {
        await this.db.execAsync(table);
      } catch (error: any) {
        // Table already exists, continue
        if (!error.message.includes('already exists')) {
          console.error('Error creating table:', error);
        }
      }
    }

    console.log('All tables created successfully');
  }

  private async seedInitialData(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      // Verificar se já existe um usuário de teste
      const result = await this.db.getFirstAsync<any>(
        'SELECT COUNT(*) as count FROM users'
      );

      if (result && result.count === 0) {
        // Inserir usuário de teste com timestamp explícito
        const now = new Date().toISOString();
        console.log(`📝 Inserindo usuário de teste com timestamp: ${now}`);
        
        await this.db.runAsync(
          `INSERT INTO users (id, email, password, name, bio, created_at) 
           VALUES (1, ?, ?, ?, ?, ?)`,
          ['teste@bfpet.com', 'senha123', 'Usuário Teste', 'Amante de pets 🐾', now]
        );

        console.log('✅ Initial data seeded successfully');
      } else if (result) {
        console.log(`ℹ️  Usuários já existem no banco: ${result.count}`);
      }
    } catch (error: any) {
      console.error('❌ Error seeding data:', error);
      console.error('📍 Stack:', error.stack);
      // NÃO lança erro - deixa app continuar
    }
  }

  getDb(): SQLite.SQLiteDatabase {
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    return this.db;
  }

  async closeDatabase(): Promise<void> {
    if (this.db) {
      await this.db.closeAsync();
      this.db = null;
    }
  }
}

export const db = Database.getInstance();
