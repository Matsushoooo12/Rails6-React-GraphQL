module Mutations
  class CreatePost < BaseMutation
    graphql_name 'CreatePost'
    field :post, Types::PostType, null: false
    argument :title, String, required: false

    def resolve(**args)
      post = Post.create(title: args[:title])
      {
        post: post,
      }
    end
  end
end
