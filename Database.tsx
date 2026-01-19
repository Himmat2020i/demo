import SQLite from 'react-native-sqlite-storage';
let db = SQLite.openDatabase({name: 'In8it.db'});
SQLite.enablePromise(true);

export const createTable = async (
  tableName: string,
  columns: string[],
  columnTypes: {[key: string]: string},
): Promise<void> => {
  try {
    const sanitizedColumns = columns.map(column => {
      const columnName = /^[0-9]/.test(column) ? `_${column}` : column;
      return `"${columnName}" ${columnTypes[column] || 'TEXT'}`;
    });

    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS ${tableName} (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          ${sanitizedColumns.join(',')}
        );
      `;
    await (await db).executeSql(createTableQuery, []);
    console.log(`Table ${tableName} created successfully`);
  } catch (e) {
    console.error('Error creating table:', e);
  }
};

export const updateStatusInTable = async (newStatus: string) => {
  try {
    const selectQuery = `
      SELECT applicationStatus FROM schemeList;
    `;
    const result = await (await db).executeSql(selectQuery, []);

    if (result.length > 0) {
      const resultObject = result[0];

      if (resultObject && resultObject.rows && resultObject.rows.length > 0) {
        let currentApplicationStatus = JSON.parse(
          resultObject.rows.item(0).applicationStatus,
        );

        if (!Array.isArray(currentApplicationStatus)) {
          currentApplicationStatus = [];
        }

        if (currentApplicationStatus.length === 0) {
          currentApplicationStatus.push({status: newStatus});
        } else {
          currentApplicationStatus[0].status = newStatus;
        }

        const updatedApplicationStatus = JSON.stringify(
          currentApplicationStatus,
        );

        const updateQuery = `
          UPDATE schemeList
          SET applicationStatus = ?
        `;
        await (await db).executeSql(updateQuery, [updatedApplicationStatus]);
        console.log(`Status updated successfully in the schemeList table`);
      } else {
        console.log('No rows found in the result set.');
      }
    } else {
      console.log('Result array is empty.');
    }
  } catch (e) {
    console.error('Error updating status in the table:', e);
  }
};

export const insertDocData = async (
  tableName: string,
  payload: any,
): Promise<void> => {
  try {
    const tableExists = await checkTableExists(tableName);

    if (!tableExists) {
      console.log(`Table ${tableName} does not exist. Creating...`);
      await createTable(
        tableName,
        [
          'answer',
          'idBusiness',
          'idQuestion',
          'idSection',
          'isTableUpdate',
          'idApplicationStatus',
        ],
        {
          answer: 'TEXT',
          idBusiness: 'INTEGER',
          idQuestion: 'INTEGER',
          idSection: 'INTEGER',
          isTableUpdate: 'INTEGER',
          idApplicationStatus: 'INTEGER',
        },
      );
    }

    await new Promise((resolve, reject) => {
      db.transaction(tx => {
        const insertQuery = `
          INSERT INTO ${tableName} (answer, idBusiness, idQuestion, idSection, isTableUpdate)
          VALUES (?, ?, ?, ?, ?)
        `;
        tx.executeSql(
          insertQuery,
          [
            payload.answer,
            payload.idBusiness,
            payload.idQuestion,
            payload.idSection,
            1,
          ],
          async (tx, result) => {
            const updateQuery = `
              UPDATE ${tableName}
              SET isTableUpdate = 1
              WHERE idQuestion = ?
            `;
            await new Promise((resolveUpdate, rejectUpdate) => {
              tx.executeSql(
                updateQuery,
                [payload.idQuestion],
                (_, result) => {
                  console.log(
                    'Data inserted and updated successfully in',
                    tableName,
                  );
                  resolveUpdate();
                },
                (tx, error) => {
                  console.error('Error updating data:', error);
                  rejectUpdate(error);
                },
              );
            });
            resolve();
          },
          (tx, error) => {
            console.error('Error inserting data:', error);
            reject(error);
          },
        );
      });
    });
  } catch (e) {
    console.error('Error inserting and updating data:', e);
  }
};
export const insertData = async (
  tableName: string,
  dataArray: any[],
): Promise<void> => {
  try {
    if (dataArray.length === 0) {
      console.log('No data to insert.');
      return;
    }

    const columns = Object.keys(dataArray[0]);
    const insertQuery = `
      INSERT INTO ${tableName} (${columns
      .map(column => `"${column}"`)
      .join(', ')})
      VALUES (${columns.map(() => '?').join(', ')})
    `;
    const tableExists = await checkTableExists(tableName);

    if (!tableExists) {
      await createTable(tableName, columns, {});
    }

    await (
      await db
    ).transaction(async tx => {
      const promises = dataArray.map(async data => {
        for (const key in data) {
          if (typeof data[key] === 'object' && data[key] !== null) {
            data[key] = JSON.stringify(data[key]);
          }
        }

        const values = columns.map(column => data[column]);
        await tx.executeSql(insertQuery, values);
      });

      await Promise.all(promises);
      console.log('Data inserted successfully', tableName);
    });
  } catch (e) {
    console.error('Error inserting data:', e);
  }
};
export const checkIsTableEmpty = async tableName => {
  try {
    const businessList = await getAllData(tableName);
    if (businessList.length > 0) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.error('Error checking table:', error);
    return false;
  }
};

export const checkTableExists = async (tableName: string) => {
  try {
    const checkTableQuery =
      "SELECT name FROM sqlite_master WHERE type='table' AND name=?;";
    const dbInstance = await db;
    const [result] = await dbInstance.executeSql(checkTableQuery, [tableName]);
    const tableExists = result.rows.length > 0;
    return tableExists;
  } catch (e) {
    console.error('Error checking table existence:', e);
    return false;
  }
};

export const getDataById = async (
  tableName: string,
  id: number,
): Promise<any[]> => {
  return new Promise<any[]>(async resolve => {
    try {
      const selectQuery = `SELECT * FROM ${tableName} WHERE idOrganisation = ?`;

      (await db).transaction(
        tx => {
          tx.executeSql(selectQuery, [id], (_, result) => {
            const rows = result.rows;
            const data: any[] = [];

            if (rows && rows.length > 0) {
              for (let i = 0; i < rows.length; i++) {
                const item = rows.item(i);
                for (const key in item) {
                  if (
                    item.hasOwnProperty(key) &&
                    typeof item[key] === 'string'
                  ) {
                    try {
                      const parsedValue = JSON.parse(item[key]);
                      item[key] = parsedValue;
                    } catch (e) {}
                  }
                }
                data.push(item);
              }
            } else {
            }

            resolve(data);
          });
        },
        error => {
          console.error('Transaction error:', error);
          resolve([]);
        },
        () => {
          console.log('Transaction completed');
        },
      );
    } catch (e) {
      console.error('Error starting transaction:', e);
      resolve([]);
    }
  });
};

export const getAllData = async (tableName: string): Promise<any[]> => {
  return new Promise<any[]>(async resolve => {
    try {
      const checkTableQuery = `SELECT name FROM sqlite_master WHERE type='table' AND name=?;`;
      const selectQuery = `SELECT * FROM ${tableName};`;

      (await db).transaction(tx => {
        tx.executeSql(checkTableQuery, [tableName], (_, result) => {
          const tableExists = result.rows.length > 0;

          if (tableExists) {
            tx.executeSql(selectQuery, [], (_, result) => {
              const rows = result.rows;
              const data: any[] = [];
              for (let i = 0; i < rows.length; i++) {
                const item = rows.item(i);
                for (const key in item) {
                  if (
                    item.hasOwnProperty(key) &&
                    typeof item[key] === 'string'
                  ) {
                    try {
                      const parsedValue = JSON.parse(item[key]);
                      item[key] = parsedValue;
                    } catch (e) {}
                  }
                }
                data.push(item);
              }

              resolve(data);
            });
          } else {
            resolve([]);
          }
        });
      });
    } catch (e) {
      console.error('Error retrieving data:', e);
      resolve([]);
    }
  });
};

export const updateAnswerInTable = async (
  idQuestion,
  idSection,
  newAnswer,
  idBusiness,
  isTableUpdate,
  isExist,
) => {
  try {
    const tableName = 'answers';
    const tableExists = await checkTableExists(tableName);

    if (!tableExists) {
      await createTable(
        tableName,
        [
          'answer',
          'idBusiness',
          'idQuestion',
          'idSection',
          'isTableUpdate',
          'idApplicationStatus',
        ],
        {
          answer: 'TEXT',
          idBusiness: 'INTEGER',
          idQuestion: 'INTEGER',
          idSection: 'INTEGER',
          isTableUpdate: 'INTEGER',
          idApplicationStatus: 'INTEGER',
        },
      );
    }

    if (isExist) {
      const updateQuery = `
        UPDATE answers
        SET answer = ?, isTableUpdate = ?
        WHERE idQuestion = ? AND idSection = ? AND idBusiness = ?;
      `;
      await (
        await db
      ).executeSql(updateQuery, [
        newAnswer,
        isTableUpdate ? 1 : 0,
        idQuestion,
        idSection,
        idBusiness,
      ]);
    } else {
      console.log('Recordsss does not exist, inserting new answer');
      const insertQuery = `
        INSERT INTO answers (idQuestion, idSection, answer, idBusiness, isTableUpdate)
        VALUES (?, ?, ?, ?, ?);
      `;
      await (
        await db
      ).executeSql(insertQuery, [
        idQuestion,
        idSection,
        newAnswer,
        idBusiness,
        1,
      ]);
    }
  } catch (e) {
    console.error('Error updating/inserting answer in the table:', e);
  }
};
export const updateIsTableUpdateInTable = async (idQuestionsArr: any[]) => {
  try {
    const ids = idQuestionsArr.join(',');
    const updateQuery = `
  UPDATE answers
  SET isTableUpdate = 0
  WHERE idQuestion IN (${ids});
`;
    await db.executeSql(updateQuery);
  } catch (e) {
    console.error('Error updating answers in the table:', e);
  }
};

export const updateAllAnswersTable = async (isTableUpdate: boolean) => {
  try {
    const updateQuery = `
      UPDATE answers
      SET isTableUpdate = ?;
    `;
    await (await db).executeSql(updateQuery, [isTableUpdate]);
  } catch (e) {
    console.error('Error updating all answers in the table:', e);
  }
};
export const removeData = async (tableName, conditions) => {
  try {
    const conditionStrings = conditions
      .map(condition => `${condition.key} = ?`)
      .join(' AND ');
    const removeQuery = `DELETE FROM ${tableName} WHERE ${conditionStrings}`;
    await (
      await db
    ).executeSql(
      removeQuery,
      conditions.map(condition => condition.value),
    );
    console.log(`Data removed successfully from ${tableName}`);
  } catch (e) {
    console.error('Error removing data:', e);
  }
};

export const updateAnswerToEmpty = async (tableName, payload) => {
  try {
    const {id, questionId, sectionId} = payload;
    const updateQuery = `
      UPDATE ${tableName} 
      SET 
        answer = CASE
          WHEN id = ? THEN ''
          ELSE answer
        END,
        isTableUpdate = CASE
          WHEN id = ? THEN 1
          WHEN id != ? AND idQuestion = ? AND idSection = ? THEN 1
          ELSE isTableUpdate
        END
      WHERE id = ? OR (idQuestion = ? AND idSection = ?)
    `;

    await db.executeSql(updateQuery, [
      id,
      id,
      id,
      questionId,
      sectionId,
      id,
      questionId,
      sectionId,
    ]);

    console.log(`Answer set to empty successfully for id ${id}`);
  } catch (e) {
    console.error('Error updating answer:', e);
  }
};

export const deleteData = async (tableName: string): Promise<void> => {
  try {
    const tableExists = await checkTableExists(tableName);
    if (tableExists) {
      const deleteQuery = `DROP TABLE IF EXISTS ${tableName};`;
      await (await db).executeSql(deleteQuery, []);
      console.log(`Table ${tableName} deleted successfully`);
    } else {
      console.log(`Table ${tableName} does not exist`);
    }
  } catch (e) {
    console.error('Error deleting table:', e);
  }
};
