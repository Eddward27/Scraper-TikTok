# Obtiene los nombres de usuario de los que se ha realizado un scraping y retorna un arreglo con todos ellos, se usa para cuando se llama al main sin argumentos
def getQueries(mycursor):
    mycursor.execute("SELECT username FROM queries;")
    myresult = mycursor.fetchall()
    queries = []
    for query in myresult:
        queries.append(query[0])
    return queries

# Cuando se solicite un scraping de un usuario que no se ha hecho antes, se agregar el nombre de usuario a la lista de usuarios que se han hecho scraping
def nuevoPerfil(mydb, mycursor, listaQueries):
    for usuario in listaQueries:
        #Verificar si el usuario ya se encuentra en la lista
        queryIF = "SELECT idQuery FROM queries WHERE username='" + usuario + "';"
        mycursor.execute(queryIF)
        myresult = mycursor.fetchall()
        #Si no lo está, se inserta
        if not myresult:
            sqlPerfilD = ("INSERT INTO queries "
                      "(username) "
                      "VALUES (%(username)s)")
            perfilD_dict = {
                'username': usuario
            }
            mycursor.execute(sqlPerfilD, perfilD_dict)
            mydb.commit()
