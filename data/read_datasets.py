import json
import random
import bson

json_files = ['dataset_exemplo1.json', 'dataset_exemplo2.json', 'dataset_exemplo3.json']

ids_usados = []

lista_ucs = []

lista_docentes = []

for file in json_files:
    with open(file, 'r', encoding='utf-8') as f:
        data = json.load(f)

        object_id_cadeira = str(bson.ObjectId())

        numero_cadeira = str(random.randint(0, 1000))
        if numero_cadeira not in ids_usados:
            ids_usados.append(numero_cadeira)
            data['numero'] = numero_cadeira

        docentes_uc = []

        for docente in data['docentes']:
            if docente['nome'] not in [docente['nome'] for docente in lista_docentes]:
                numero_docente = str(random.randint(0, 1000))

                if numero_docente not in ids_usados:
                    ids_usados.append(numero_docente)
                    docente['numero'] = numero_docente

                docente['nivel'] = 'docente'

                docente['ano'] = ''

                docente['cursos'] = ['Licenciatura em Engenharia Informática']

                docente['password'] = '1234'

                object_id = str(bson.ObjectId())

                docente['_id'] = object_id

                lista_docentes.append(docente)

            lista_docentes_index = [docente['nome'] for docente in lista_docentes].index(docente['nome'])

            docentes_uc.append(lista_docentes[lista_docentes_index]['_id'])

            if 'cadeiras' not in lista_docentes[lista_docentes_index]:
                lista_docentes[lista_docentes_index]['cadeiras'] = [object_id_cadeira]
            else:
                lista_docentes[lista_docentes_index]['cadeiras'].append(object_id_cadeira)

        data['docentes'] = docentes_uc

        if data['sigla'] not in [uc['sigla'] for uc in lista_ucs]:
            lista_ucs.append(data)

        data['inscritos'] = []

with open('ucs.json', 'w', encoding='utf-8') as f:
    json.dump(lista_ucs, f, indent=4, ensure_ascii=False)

with open('users.json', 'w', encoding='utf-8') as f:
    json.dump(lista_docentes, f, indent=4, ensure_ascii=False)
