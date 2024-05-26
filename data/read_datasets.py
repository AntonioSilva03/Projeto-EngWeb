import json
import random

json_files = ['dataset_exemplo1.json', 'dataset_exemplo2.json', 'dataset_exemplo3.json']

ids_usados = []

lista_ucs = []

lista_docentes = []

for file in json_files:
    with open(file, 'r', encoding='utf-8') as f:
        data = json.load(f)

        _id = str(random.randint(0, 1000))
        if _id not in ids_usados:
            ids_usados.append(_id)
            data['_id'] = _id

        docentes_uc = []

        for docente in data['docentes']:
            if docente['nome'] not in [docente['nome'] for docente in lista_docentes]:
                docente['password'] = "1234"
                id_docente = str(random.randint(0, 1000))

                if id_docente not in ids_usados:
                    ids_usados.append(id_docente)
                    docente['_id'] = id_docente

                docente['nivel'] = 'docente'

                docente['ano'] = ''

                docente['cursos'] = ['Licenciatura em Engenharia Informática']

                lista_docentes.append(docente)

            docentes_uc.append(id_docente)

            lista_docentes_index = [docente['nome'] for docente in lista_docentes].index(docente['nome'])

            if 'cadeiras' not in lista_docentes[lista_docentes_index]:
                docente['cadeiras'] = [_id]
            else:
                lista_docentes[lista_docentes_index]['cadeiras'].append(_id)

        data['docentes'] = docentes_uc

        if data['sigla'] not in [uc['sigla'] for uc in lista_ucs]:
            lista_ucs.append(data)

        data['inscritos'] = []

with open('ucs.json', 'w', encoding='utf-8') as f:
    json.dump(lista_ucs, f, indent=4, ensure_ascii=False)

with open('users.json', 'w', encoding='utf-8') as f:
    json.dump(lista_docentes, f, indent=4, ensure_ascii=False)