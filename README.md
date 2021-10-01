# Rails6 + React + GraphQL

## Rails プロジェクト作成

まずは Rails の API モードでプロジェクト作成します。

```
$ rails new プロジェクト名 --api
```

## GraphQL 用の Gem 追加

Gemfile

```
gem 'graphql'
group :development do
    gem 'graphiql-rails'
end
```

```
$ bundle install
```

## gem 'sprocket' のバージョンを 3.7.2 に下げる

sprockets4.0.0 になってから assets ファイルがないとエラーが出るようです。

なのでバージョンを下げると解消できます。

Gemfile

```
gem 'sprockets', '~> 3.7.2'
```

```
$ bundle update
```

config/application.rb

```
require "sprockets/railtie"    #コメントアウトを外す
```

## GraphQL をインストール

```
$ rails g graphql:install
```

## GraphQL のルーティング設定

```
Rails.application.routes.draw do
  if Rails.env.development?
    # add the url of your end-point to graphql_path.
    mount GraphiQL::Rails::Engine, at: "/graphiql", graphql_path: "/graphql"
  end
  post '/graphql', to: 'graphql#execute'  #ここはrails generate graphql:installで自動生成される
end
```

## GraphQL で確認

以下にアクセス

http://localhost:3000/graphiql

app/graphql/types/query_type.rb

```
module Types
  class QueryType < Types::BaseObject
    # Add `node(id: ID!) and `nodes(ids: [ID!]!)`
    include GraphQL::Types::Relay::HasNodeField
    include GraphQL::Types::Relay::HasNodesField

    # Add root-level fields here.
    # They will be entry points for queries on your schema.

    # TODO: remove me
    field :test_field, String, null: false,
      description: "An example field added by the generator"
    def test_field
      "Hello World!"
    end
  end
end
```

このデフォルトの記述にある test_field にアクセスしてみます。

```
{
    testField
}
```

以下の画像のように表示されたら成功です。

<img width="839" alt="スクリーンショット 2021-10-01 10 31 36" src="https://user-images.githubusercontent.com/66903388/135551984-09f88ca4-d130-4590-8fe7-4d4997c0ae2f.png">
