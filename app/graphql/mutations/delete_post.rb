module Mutations
  class DeletePost < BaseMutation
    graphql_name 'DeletePost'

    field :post, Types::PostType, null: false

    argument :id, ID, required: true

    def resolve(**args)
      post = Post.find(args[:id])
      post.destroy
      {
        post: post
      }
    end
  end
end
