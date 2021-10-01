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

## Post モデル作成

基本的な Post モデルを作成してデータを作成して GraphQL で表示してみます。

```
$ rails g model Post title:string
$ rails db:migrate
```

posts テーブルの title カラムを作成しました。

## データ作成

表示確認するためのダミーデータを作成します。

```
$ rails c
Running via Spring preloader in process 82328
Loading development environment (Rails 6.1.4.1)
irb(main):001:0> Post.create(title: "test1")
irb(main):001:0> Post.create(title: "test2")
```

## PostType を作成する

GraphQL では各 Type を基に Query の実行を行なっていきます。

そこで、Post の Type を定義するため、以下のコマンドを流し Post Type を作成します。

```
$ rails g graphql:object Post
```

app/graphql/types/post_type.rb というファイルが作成され以下の中身が記述されています。

app/graphql/types/post_type.rb

```
module Types
  class PostType < Types::BaseObject
    field :id, ID, null: false
    field :title, String, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end
```

## Query Resolver を作成

Type は定義されましたが、サーバはこのタイプをどのように扱えば良いかわかりません。

そこで、実際に queries を実行するために resolver を作成していきます。

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

    # get all posts
    field :posts, [Types::PostType], null: false
    def posts
      Post.all
    end

    # get a post
    field :post, Types::PostType, null: false do
      argument :id, Int, required: false
    end
    def post(id:)
      Post.find(id)
    end
  end
end
```

## GraphQL で確認

以下にアクセス

http://localhost:3000/graphiql

Get all posts

```
{
    posts{
        id
        title
    }
}
```

<img width="839" alt="スクリーンショット 2021-10-01 10 52 00" src="https://user-images.githubusercontent.com/66903388/135553420-6d99b5f0-e8c8-490c-88bd-9d0e6ac38365.png">

Get a post

```
{
    post(id: 1){
        id
        title
    }
}
```

<img width="839" alt="スクリーンショット 2021-10-01 10 54 11" src="https://user-images.githubusercontent.com/66903388/135553584-34cb9adc-5a94-4889-8a3c-c0f0bd842579.png">
