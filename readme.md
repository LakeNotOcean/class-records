# Class Records

## Описание

Тестовое задание для компании Газпром информ.
Представляет собой монорепозиторий с 2 приложениями - генератор данных и веб-api для запросов, а также механизмы для генерации и применение миграций.

## Настройка

При работе с любым приложениями предварительно необходимо указать верные параметры в файле-конфигуракции:
**env/dev.env**
и установить используемые пакеты командой:
`npm install`

## Создание структуры бд

- Сгенерировать миграции на основе классов-сущностей можно командой:
  `npm run migration:generate-dev`
- Предварительно миграционные файлы уже сгенерированы по пути **libs\common\src\dbContext\migrations**.
- Применение миграций осуществяется командой:
  `npm run migration:run-dev`
  **Внимание! Генерация учитывает схему, которая указанна в файле-конфигурации, миграции в репозитории используют схему "class"**.

В качестве альтернативы можно использовать sql-скрипт из папки **sql**.

## Генерация данных

Генератор построен на основе [Nest-Commander](https://nest-commander.jaymcdoniel.dev/en/introduction/intro/). Для сборки генератора нужно выполнить:
`npm run data-generator:build`
Доступны следующие команды:

- `npm run data-generator -- ` - генерация данных для выбранной таблицы. Доступны следующие аргументы:
  -t --table (students|teachers|lessons) - таблица для генерации
  -q --quantity - число генерируемых записей
  **Внимание! Генерация таблицы lessons пока работает неэффективно и лучше не генериовать более 10^4 записей**
- `npm run data-generator:cleansing --` - очистка выбранной таблицы. Таблица lessons очищается при любом изменении. Аргументы скрипта:
  -t --table (students|teachers|lessons) - таблица для очистки

Альтернативно можно скачать готовый seed по [ссылке](https://disk.yandex.ru/d/vkkZojFcfJxnCw).

## Веб-api

- Сборка веб-api:
  `npm run class-records-api:build`
- Запуск веб-api:
  `npm run class-records-api`

Для приложения достпна документация в swagger по web-адресу _/swagger_
